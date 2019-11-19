const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const User = require("../database/user")

const fields = {
    getUser: { id: "objectid" },
    getUserByUsername: { username: "string" },
    addUser: { username: "string" },
    removeUser: { id: "string" }
}

router.get("/byId", validate(fields.getUser), async (req, res) => {
    try {
        const id = req.query.id;
        let user = User.getUser(id)
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
        let user = User.getUserByUsername(username)
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
        let newUserId = await User.addUser(userReq);
        res.json({ id: newUserId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
})

router.delete("/", validate(fields.removeUser), async (req, res) => {
    try {
        const id = req.body.id
        await User.removeUser(id)
        res.json({ message: "Successfully deleted user" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An internal server error occured" })
    }
})

module.exports = router;