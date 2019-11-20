let {Schema, model} = require("mongoose")

let recipientSchema = Schema({
    name: String,
    priceLimit: Number,
    userId: Schema.Types.ObjectId
})

let recipientModel = model("recipient", recipientSchema)
recipientModel.prototype.toString = function(){
    return JSON.stringify({
        name: this.name,
        priceLimit: this.priceLimit,
        userId: this.userId,
    })
}
module.exports = recipientModel