const User = require("../models/user")
const Recipient = require("./recipient")
const Idea = require("./idea")
const Gift = require("./gift")

let getUser = async (id) => {
    return await User.findById(id)
}

let getUserByUsername = async (username) => {
    return {
        name: "nickjm6"
    }
}

let addUser = async (req) => {
    let newUser = new User(req)
    await newUser.save()
    return newUser._id
}

let removeUser = async (id) => {
    let user = await getUser(id)
    if(!user)
        throw new Error(`Could not find a user with the id '${id}`)
    await Recipient.removeByUser(id)
    await Idea.removeByUser(id)
    await Gift.removeByUser(id)
    await User.findByIdAndDelete(id)
}

let addGift = async (id, giftId) => {
    let user = await getUser(id)
    let currentGifts = user.gifts;
    if(currentGifts.includes(giftId))
        throw new Error(`user ${user.username} already has gift with id '${giftId}'`)
    user.gifts.push(giftId)
    await user.save()
}

let removeGift = async (id, giftId) => {
    let user = await getUser(id)
    if(!user)
        return;
    let currentGifts = user.giftId
    user.gifts = currentGifts.filter(gift => gift != giftId)
    await user.save()
}

let addIdea = async (id, ideaId) => {
    let user = await getUser(id)
    let currentIdeas = user.ideas;
    if(currentIdeas.includes(ideaId))
        throw new Error(`user ${user.username} already has gift with id '${ideaId}'`)
    user.ideas.push(ideaId)
    await user.save()
}

let removeIdea = async (id, ideaId) => {
    let user = await getUser(id)
    if(!user)
        return;
    let currentIdeas = user.ideas
    user.ideas = currentIdeas.filter(idea => idea != ideaId)
    await user.save()
}

let addRecipient = async (id, recipientId) => {
    let user = await getUser(id)
    let currentRecipients = user.recipients;
    if(currentRecipients.includes(recipientId))
        throw new Error(`user ${user.username} already has gift with id '${recipientId}'`)
    user.recipients.push(recipientId)
    await user.save()
}

let removeRecipient = async (id, recipientId) => {
    let user = await getUser(id)
    if(!user)
        return;
    let currentRecipients = user.recipients
    user.recipients = currentRecipients.filter(recipient => recipient != recipientId)
    await user.save()
}

module.exports = {getUser, addGift, removeGift, addIdea, removeIdea, addRecipient, removeRecipient, removeUser, addUser}