let {Schema, model} = require("mongoose")

let userSchema = Schema({
    username: String,
    recipients: [Schema.Types.ObjectId],
    ideas: [Schema.Types.ObjectId],
    gifts: [Schema.Types.ObjectId]
})
let userModel = model("user", userSchema)
userModel.prototype.toString = function() {
    return JSON.stringify({
        username: this.username,
        recipients: this.recipients ? this.recipients.map(rec => rec.toString()) : [],
        ideas: this.ideas ? this.ideas.map(idea => idea.toString) : [],
        gifts: this.gifts ? this.gifts.map(gift => gift.toString()) : []
    })
}
module.exports = userModel