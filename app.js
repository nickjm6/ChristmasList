const express = require("express");
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const session = require("express-session")

require("dotenv").config()

const passport = require("passport")
const auth = require("./src/utils/auth")

app.use(session({ secret: process.env.SESSION_SECRET }))
auth(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

const mongoAddress = process.env.MONGO_ADDR
if (!mongoAddress || typeof mongoAddress !== "string")
    throw new Error("please set a valid mongodb address in .env with the name MONGO_ADDR")

mongoose.set("useUnifiedTopology", true)
mongoose.set("useCreateIndex", true)
mongoose.set("useFindAndModify", false)
mongoose.connect(mongoAddress, { useNewUrlParser: true })

const port = process.env.PORT || 8080

app.use("/javascript", express.static(`${__dirname}/frontend/javascript`))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/frontend/index.html`)
})

app.get("/error", (req, res) => {
    res.sendFile(`${__dirname}/frontend/error.html`)
})

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/error'
    })
);

app.use("/user", require("./src/routes/user"))
app.use("/gift", require("./src/routes/gift"))
app.use("/idea", require("./src/routes/idea"))
app.use("/recipient", require("./src/routes/recipient"))

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))
