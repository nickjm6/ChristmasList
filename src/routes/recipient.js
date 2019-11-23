const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const sanitize = require("../utils/sanititizeBody")
const { getRecipient, addRecipient, removeRecipient, editRecipient } = require("../database/databaseOperations").recipient

const fields = {
    getRecipient: { id: "objectid" },
    addRecipient: { name: "string", priceLimit: "number", userId: "objectid" },
    editRecipient: { id: "objectid", values: "object" },
    editRecipientValues: { name: "string", priceLimit: "number" },
    removeRecipient: { id: "objectid" }
}

router.get("/", validate(fields.getRecipient), async (req, res) => {
    try {
        const id = req.query.id;
        let recipient = await getRecipient(id)
        if (!recipient)
            res.status(400).json({ message: "No recipient was found with that id" })
        else
            res.json({ recipient })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An internal server error occured" })
    }
});

router.post("/", validate(fields.addRecipient), async (req, res) => {
    try {
        const { name, priceLimit, userId } = req.body;
        const recipientReq = { name, priceLimit, userId }
        let newRecipientId = await addRecipient(recipientReq)
        res.json({ id: newRecipientId })
    } catch (err) {
        console.error(err)
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: "The user you are trying to add a recipient to was not found" })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

router.put("/", validate(fields.editRecipient), sanitize(fields.editRecipientValues), async (req, res) => {
    try {
        const { id, values } = req.body;
        await editRecipient(id, values)
        res.json({ message: "Successfully edited recipient" })
    } catch (err) {
        console.error(err);
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: "The recipient you are trying to edit was not found" })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

router.delete("/", validate(fields.removeRecipient), async (req, res) => {
    try {
        const id = req.body.id
        await removeRecipient(id)
        res.json({ message: "Successfully deleted recipient" })
    } catch (err) {
        console.error(err)
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: "The recipient you are trying to delete was not found" })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

module.exports = router;