const express = require("express");
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

require("dotenv").config()

const mongoAddress = process.env.MONGO_ADDR
if (!mongoAddress || typeof mongoAddress !== "string" || !/^mongodb:\/\/[a-zA-Z]+\/[a-zA-Z]+$/.test(mongoAddress))
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

app.use("/user", require("./src/routes/user"))
app.use("/gift", require("./src/routes/gift"))
app.use("/idea", require("./src/routes/idea"))
app.use("/recipient", require("./src/routes/recipient"))

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))
