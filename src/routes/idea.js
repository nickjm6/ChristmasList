const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const sanitize = require("../utils/sanititizeBody")

const fields = {
    getIdea: {id: "string"},
    addIdea: {name: "string", userId: "string"},
    editIdea: {id: "string", values: "object"},
    removeIdea: {id: "string"}
}

router.get("/", validate(fields.getIdea), (req, res) => {
    const id = req.query.id;
    let idea = {
        name: "Football",
        recipient: "Johnny",
        username: "Nick"
    }
    res.json({idea})
});

router.post("/", validate(fields.addIdea), (req, res) => {
    const {name, price, recipientId} = req.body;
    const newIdea = {name, price, recipientId}
    res.json({message: "success"})
})

router.put("/", validate(fields.editIdea), sanitize(fields.addIdea), (req, res) => {
    const {id, values} = req.body;
    res.json({message: "success"})
})

router.delete("/", validate(fields.removeIdea), (req, res) => {
    const id = req.body.id
    res.json({message: "success"})
})

module.exports = router;