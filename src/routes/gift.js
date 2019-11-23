const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const sanitize = require("../utils/sanititizeBody")
const { getGift, addGift, removeGift, editGift } = require("../database/databaseOperations").gift

const fields = {
    getGift: { id: "objectid" },
    addGift: { name: "string", price: "number", userId: "objectid" },
    editGift: { id: "objectid", values: "object" },
    editGiftValues: { name: "string", price: "number", recipientId: "objectid" },
    removeGift: { id: "objectid" }
}

router.get("/", validate(fields.getGift), async (req, res) => {
    try {
        const id = req.query.id
        let gift = await getGift(id)
        if (!gift)
            res.status(400).json({ message: "No gift was found with that id" })
        else
            res.json({ gift })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
});

router.post("/", validate(fields.addGift), async (req, res) => {
    try {
        const { name, price, recipientId, userId } = req.body;
        const giftReq = { name, price, recipientId, userId }
        let newGiftId = await addGift(giftReq);
        res.json({ id: newGiftId })
    } catch (err) {
        console.error(err)
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: `Failed to find ${err.item} that you are referencing when adding gift` })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }

})

router.put("/", validate(fields.editGift), sanitize(fields.editGiftValues), async (req, res) => {
    try {
        const { id, values } = req.body;
        await editGift(id, values)
        res.json({ message: "Successfully updated gift" })
    } catch (err) {
        console.error(err);
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: "Failed to find the gift that you are trying to edit" })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

router.delete("/", validate(fields.removeGift), async (req, res) => {
    try {
        const id = req.body.id;
        await removeGift(id)
        res.json({ message: "Successfully deleted gift" })
    } catch (err) {
        console.error(err)
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: "Failed to find the gift that you are trying to delete" })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

module.exports = router;