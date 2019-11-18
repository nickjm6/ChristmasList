let {Schema, model} = require("mongoose")

let giftSchema = Schema({
    name: String,
    price: Number,
    recipientId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
})

let giftModel = model("gift", giftSchema)
giftModel.prototype.toString = function() {
    return JSON.stringify({
        name: this.name,
        price: this.price,
        recipientId: this.recipientId,
        userId: this.userId
    })
}
module.exports = giftModel