const express = require("express");
const app = express()
const bodyParser = require("body-parser")

require("dotenv").config()

const port = process.env.PORT || 8080

app.use("/javascript", express.static(`${__dirname}/frontend/javascript`))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/frontend/index.html`)
})

// app.use("/user", require("./src/routes/user"))
app.use("/gift", require("./src/routes/gift"))
app.use("/idea", require("./src/routes/idea"))
app.use("/recipient", require("./src/routes/recipient"))

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))