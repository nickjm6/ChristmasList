let {Schema, model} = require("mongoose")

let ideaSchema = Schema({
    name: String,
    price: Number,
    recipientId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
})

module.exports = model("idea", ideaSchema)