const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const { removeUser } = require("../database/databaseOperations").user
const authenticate = require("../utils/authenticate")

const fields = {
    getUserInfo: { whosAround: "string" }
}

router.use(authenticate())

router.get("/", validate(fields.getUserInfo), async (req, res) => {
    try {
        let user = req.user
        let whosAround = req.query.whosAround
        whosAround = whosAround == '' ? [] : whosAround.split(",")
        user.recipients = user.recipients.filter(recipient => !whosAround.includes(recipient.name))
        res.json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json()
    }
})

router.delete("/", async (req, res) => {
    try {
        const id = req.user._id
        await removeUser(id)
        res.json({ message: "Successfully deleted user" })
    } catch (err) {
        console.error(err)
        if (err.name == "NotFoundError") {
            res.status(400).json({ message: "The user you are trying to delete was not found" })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

module.exports = router;