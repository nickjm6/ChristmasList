let {Schema, model} = require("mongoose")

let giftSchema = Schema({
    name: String,
    price: Number,
    recipientId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
})

module.exports = model("gift", giftSchema)