let {Schema, model} = require("mongoose")

let userSchema = Schema({
    username: String,
    token: String,
    googleId: String,
})

let userModel = model("user", userSchema)
userModel.prototype.toString = function() {
    return JSON.stringify({
        username: this.username
    })
}
module.exports = userModel