const express = require("express")
const router = express.Router()
const validate = require("../utils/validateBody")
const sanitize = require("../utils/sanititizeBody")

const fields = {
    getUser: { id: "objectid" },
    getUserByUsername: { username: "string" },
    addUser: { username: "string" },
    removeUser: { username: "string" }
}

router.get("/byId", validate(fields.getUser), (req, res) => {
    const id = req.query.id;
    let user = {
        name: "Nick",
        recipients: [
            {
                name: "Johnny",
                priceLimit: 34,
                gifts: [{
                    name: "Football",
                    price: 9.99
                }],
                ideas: [{
                    name: "Baseball"
                }]
            },
            {
                name: "Billy",
                priceLimit: 50,
                gifts: [{
                    name: "Funko Pop",
                    price: 12
                },
                {
                    name: "Playstation 4",
                    price: 299.99
                }],
                ideas: [{
                    name: "Darth vader funko pop",
                    price: 12
                },
                {
                    name: "Nintendo Switch"
                }]
            }
        ],
    }
    res.json({ user })
});

router.get("/byUsername", validate(fields.getUserByUsername), (req, res) => {
    const username = req.query.username
    let user = {
        name: "Joe",
        recipients: [
            {
                name: "Jack",
                priceLimit: 20,
                gifts: [],
                ideas: []
            }
        ]
    }
    res.json({user})
})

router.post("/", validate(fields.addUser), (req, res) => {
    const { username } = req.body;
    const newUser = { username }
    res.json({ message: "success" })
})

router.delete("/", validate(fields.removeUser), (req, res) => {
    const username = req.body.username
    res.json({ message: "success" })
})

module.exports = router;