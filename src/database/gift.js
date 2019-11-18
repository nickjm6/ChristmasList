const Gift = require("../models/gift")
const Recipient = require("./recipient")
const User = require("./user")

let getGift = async (id) => {
    return await Gift.findById(id);
}

let addGift = async (req) => {
    const { userId, recipientId } = req;
    let user = await User.getUser(userId)
    if (!user)
        throw new Error(`A user was not found with the id: '${userId}'`)
    let newGift = new Gift(req)
    if (recipientId)
        await Recipient.addGift(recipientId, newGift._id)
    await newGift.save()
    await User.addGift(userId, newGift._id)
    return newGift._id;
}

let editGift = async (id, req) => {
    await Gift.findByIdAndUpdate(id, req)
}

let removeGift = async (id) => {
    let gift = await getGift(id)
    if (!gift)
        throw new Error(`Could not find a gift with the id '${id}'`)
    let { recipientId, userId } = gift
    await User.removeGift(userId, id)
    await Recipient.removeGift(recipientId, id)
    await Gift.findByIdAndDelete(id)
}

let removeRecipientId = async (recipientId) => {
    await Gift.updateMany({ recipientId }, { recipientId: null })
}

let removeByUser = async (userId) => {
    await Gift.deleteMany({ userId })
}

let getGiftsByRecipient = async (recipientId) => {
    return await Gift.find({ recipientId })
}

module.exports = { getGift, addGift, editGift, removeGift, getGiftsByRecipient, removeRecipientId, removeByUser }