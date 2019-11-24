const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const { getUser, getUserByUsername, addUser, removeUser } = require("../database/databaseOperations").user

const fields = {
    getUser: { id: "objectid" },
    getUserByUsername: { username: "string" },
    addUser: { username: "string" },
    removeUser: { id: "string" }
}

router.get("/byId", validate(fields.getUser), async (req, res) => {
    try {
        const id = req.query.id;
        let user = await getUser(id)
        if (!user)
            res.status(400).json({ message: "No user was found with that id" })
        else
            res.json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
});

router.get("/byUsername", validate(fields.getUserByUsername), async (req, res) => {
    try {
        const username = req.query.username
        let whosAround = req.query.whosAround
        whosAround = whosAround == '' ? [] : whosAround.split(",")
        let user = await getUserByUsername(username, whosAround)
        if (!user)
            res.status(400).json({ message: "No user was found with that username" })
        else
            res.json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json()
    }
})

router.post("/", validate(fields.addUser), async (req, res) => {
    try {
        const { username } = req.body;
        const userReq = { username }
        let newUserId = await addUser(userReq);
        res.json({message: "Successfully added user", id: newUserId })
    } catch (err) {
        if (err.name == "MongoError" && err.code == 11000) {
            res.status(400).json({ message: "Username already exists!" })
        } else {
            res.status(500).json({ message: "An internal server error occured" })
        }
    }
})

router.delete("/", validate(fields.removeUser), async (req, res) => {
    try {
        const id = req.body.id
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