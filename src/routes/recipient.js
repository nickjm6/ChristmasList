const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const sanitize = require("../utils/sanititizeBody")

const fields = {
    getRecipient: {id: "objectid"},
    addRecipient: {name: "string", priceLimit: "number", userId: "objectid"},
    editRecipient: {id: "objectid", values: "object"},
    removeRecipient: {id: "objectid"}
}

router.get("/", validate(fields.getRecipient), (req, res) => {
    const id = req.query.id;
    let recipient = {
        name: "Johnny",
        priceLimit: 30
    }
    res.json({recipient})
});

router.post("/", validate(fields.addRecipient), (req, res) => {
    const {name, priceLimit, userId} = req.body;
    const newIdea = {name, priceLimit, userId}
    res.json({message: "success"})
})

router.put("/", validate(fields.editRecipient), sanitize(fields.addRecipient), (req, res) => {
    const {id, values} = req.body;
    res.json({message: "success"})
})

router.delete("/", validate(fields.removeRecipient), (req, res) => {
    const id = req.body.id
    res.json({message: "success"})
})

module.exports = router;