const Recipient = require("../models/recipient")
const User = require("./user")

let getRecipient = async (_id) => {
    return await Recipient.findById(_id);
}

let addRecipient = async (req) => {
    let userId = req.userId;
    let user = await User.getUser(userId)
    if(!user)
        throw new Error(`Failed to find user with the id: '${userId}'`)
    let newRecipient = new Recipient(req)
    user.addRecipient(newRecipient._id)
    await newRecipient.save()
    return newRecipient._id;
}

let editRecipient = async (id, req) => {
    await Recipient.findByIdAndUpdate(id, req)
}

let removeRecipient = async (id) => {
    let recipient = await getRecipient(id)
    if(!recipient)
        throw new Error(`Could not find a recipient with the id '${id}'`)
    let userId = recipient.userId;
    User.removeRecipient(userId, id)
    await Recipient.findByIdAndDelete(id)
}

let getRecipientsByUser = async (userId) => {
    return await Recipient.find({userId})
}

let removeByUser = async (userId) => {
    await Recipient.deleteMany({userId})
}

let addGift = async (id, giftId) => {
    let recipient = await getRecipient(id)
    let currentGifts = recipient.gifts;
    if(currentGifts.includes(giftId))
        throw new Error(`recipient ${recipient.name} already has gift with id '${giftId}'`)
    recipient.gifts.push(giftId)
    await recipient.save()
}

let removeGift = async (id, giftId) => {
    let recipient = await getRecipient(id)
    if(!recipient)
        return;
    let currentGifts = recipient.giftId
    recipient.gifts = currentGifts.filter(gift => gift != giftId)
    await recipient.save()
}

let addIdea = async (id, ideaId) => {
    let recipient = await getRecipient(id)
    let currentIdeas = recipient.ideas;
    if(currentIdeas.includes(ideaId))
        throw new Error(`recipient ${recipient.name} already has gift with id '${ideaId}'`)
    recipient.ideas.push(ideaId)
    await recipient.save()
}

let removeIdea = async (id, ideaId) => {
    let recipient = await getRecipient(id)
    if(!recipient)
        return;
    let currentIdeas = recipient.ideas
    recipient.ideas = currentIdeas.filter(idea => idea != ideaId)
    await recipient.save()
}

module.exports = {getRecipient, addRecipient, editRecipient, removeRecipient, getRecipientsByUser, addGift, removeGift, addIdea, removeIdea, removeByUser}