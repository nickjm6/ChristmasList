const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const sanitize = require("../utils/sanititizeBody")
const Recipient = require("../database/recipient")

const fields = {
    getRecipient: { id: "objectid" },
    addRecipient: { name: "string", priceLimit: "number", userId: "objectid" },
    editRecipient: { id: "objectid", values: "object" },
    removeRecipient: { id: "objectid" }
}

router.get("/", validate(fields.getRecipient), async (req, res) => {
    try {
        const id = req.query.id;
        let recipient = await Recipient.getRecipient(id)
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
        let newRecipientId = await Recipient.addRecipient(recipientReq)
        res.json({ id: newRecipientId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
})

router.put("/", validate(fields.editRecipient), sanitize(fields.addRecipient), async (req, res) => {
    try {
        const { id, values } = req.body;
        await Recipient.editRecipient(id, values)
        res.json({ message: "Successfully edited recipient" })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An internal server error occured" })
    }
})

router.delete("/", validate(fields.removeRecipient), async (req, res) => {
    try {
        const id = req.body.id
        await Recipient.removeRecipient(id)
        res.json({ message: "Successfully deleted recipient" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
})

module.exports = router;