const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const sanitize = require("../utils/sanititizeBody")
const { getIdea, addIdea, removeIdea, editIdea, ideaToGift } = require("../database/databaseOperations").idea
const authenticate = require("../utils/authenticate")

const fields = {
    getIdea: { id: "objectid" },
    addIdea: { name: "string", userId: "objectid" },
    editIdea: { id: "objectid", values: "object" },
    editIdeaValues: { price: "number", recipientId: "objectid", name: "string" },
    removeIdea: { id: "objectid" }
}

router.use(authenticate())

router.get("/", validate(fields.getIdea), async (req, res) => {
    try {
        const id = req.query.id;
        let idea = await getIdea(id);
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
        const userId = req.user._id
        const ideaReq = { name, price, recipientId, userId }
        let newIdeaId = await addIdea(ideaReq)
        res.json({message: "Successfully added idea", id: newIdeaId })
    } catch (err) {
        console.error(err)
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: `Could not find ${err.item} that you are trying to reference when creating idea` })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

router.post("/makeGift", validate(fields.editIdea), sanitize(fields.editIdeaValues), async (req, res) => {
    try {
        const { id, values } = req.body
        await ideaToGift(id, values)
        res.json({ message: "Successfully turned idea into gift!" })
    } catch (err) {
        console.error(err)
        switch (err.name) {
            case "NotFoundError":
                res.status(400).json({ message: `Failed to find the idea that you are trying to make a gift` })
                break;
            default:
                res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

router.put("/", validate(fields.editIdea), sanitize(fields.editIdeaValues), async (req, res) => {
    try {
        const { id, values } = req.body;
        await editIdea(id, values)
        res.json({ message: "Successfully edited idea" })
    } catch (err) {
        console.error(err)
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: "Failed to find the idea that you are trying to edit" })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

router.delete("/", validate(fields.removeIdea), async (req, res) => {
    try {
        const id = req.body.id
        await removeIdea(id)
        res.json({ message: "Successfully deleted idea" })
    } catch (err) {
        console.error(err)
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: "Failed to find the idea that you are trying to delete" })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

module.exports = router;