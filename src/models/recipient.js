let {Schema, model} = require("mongoose")

let recipientSchema = Schema({
    name: String,
    priceLimit: Number,
    userId: Schema.Types.ObjectId,
    gifts: [Schema.Types.ObjectId],
    ideas: [Schema.Types.ObjectId]
})

let recipientModel = model("recipient", recipientSchema)
recipientModel.prototype.toString = function(){
    return JSON.stringify({
        name: this.name,
        priceLimit: this.priceLimit,
        userId: this.userId,
        gifts: this.gifts.map(gift => gift.toString()),
        ideas: this.ideas.map(idea => idea.toString())
    })
}
module.exports = recipientModel