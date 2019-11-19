const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const sanitize = require("../utils/sanititizeBody")
const Idea = require("../database/idea")

const fields = {
    getIdea: { id: "objectid" },
    addIdea: { name: "string", userId: "objectid" },
    editIdea: { id: "objectid", values: "object" },
    removeIdea: { id: "objectid" }
}

router.get("/", validate(fields.getIdea), async (req, res) => {
    try {
        const id = req.query.id;
        let idea = await Idea.getIdea(id);
        if (!idea)
            res.status(400).json({ message: "No Idea was found with that id" })
        else
            res.json({ idea })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
});

router.post("/", validate(fields.addIdea), async (req, res) => {
    try {
        const { name, price, recipientId } = req.body;
        const ideaReq = { name, price, recipientId, userId }
        let newIdeaId = await Idea.addIdea(ideaReq)
        res.json({ id: newIdeaId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
})

router.put("/", validate(fields.editIdea), sanitize(fields.addIdea), async (req, res) => {
    try {
        const { id, values } = req.body;
        await Idea.editIdea(id, values)
        res.json({ message: "Successfully edited idea" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
})

router.delete("/", validate(fields.removeIdea), async (req, res) => {
    try {
        const id = req.body.id
        await Idea.removeIdea(id)
        res.json({ message: "Successfully deleted idea" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
})

module.exports = router;