let {Schema, model} = require("mongoose")

let recipientSchema = Schema({
    name: String,
    priceLimit: Number,
    userId: Schema.Types.ObjectId,
    gifts: [Schema.Types.ObjectId],
    ideas: [Schema.Types.ObjectId]
})

module.exports = model("recipient", recipientSchema)