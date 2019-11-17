const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const sanitize = require("../utils/sanititizeBody")

const fields = {
    getGift: {id: "string"},
    addGift: {name: "string", price: "number", recipientId: "string", userId: "string"},
    editGift: {id: "string", values: "object"},
    removeGift: {id: "string"}
}

router.get("/", validate(fields.getGift), (req, res) => {
    const id = req.query.id
    let gift = {
        name: "Football",
        price: 12.99,
        recipient: "Johnny",
        username: "Nick"
    }
    res.json({gift})
});

router.post("/", validate(fields.addGift), (req, res) => {
    const {name, price, recipientId} = req.body;
    const newGift = {name, price, recipientId, userId}
    res.json({message: "success"})
})

router.put("/", validate(fields.editGift), sanitize(fields.addGift), (req, res) => {
    const {id, values} = req.body;
    res.json({message: "success"})
})

router.delete("/", validate(fields.removeGift), (req, res) => {
    const id = req.body.id;
    res.json({message: "success"})
})

module.exports = router;