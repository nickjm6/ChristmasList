let {Schema, model} = require("mongoose")

let ideaSchema = Schema({
    name: String,
    price: Number,
    recipientId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
})

let ideaModel = model("idea", ideaSchema)
ideaModel.prototype.toString = function() {
    return JSON.stringify({
        name: this.name,
        price: this.price,
        recipientId: this.recipientId.toString(),
        userId: this.userId.toString()
    })
}
module.exports = ideaModel