let {Schema, model} = require("mongoose")

let userSchema = Schema({
    username: String,
    recipients: [Schema.Types.ObjectId],
    ideas: [Schema.Types.ObjectId]
})

module.exports = model("user", userSchema)