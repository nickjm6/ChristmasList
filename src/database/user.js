const User = require("../models/user")
const Recipient = require("./recipient")
const Idea = require("./idea")
const Gift = require("./gift")

let getUser = async (id) => {
    return await User.findById(id)
}

let getUserByUsername = async (username) => {
    let user = await User.findOne({username})
    if(!user)
        return null
    let recipients = user.recipients.map(async recipient => await Recipient.getRecipient(recipient))
        .filter(recipient => recipient != null)
        .map(recipient => {
            recipient.gifts = recipient.gifts.map(async gift => await Gift.getGift(gift)).filter(gift => gift != null)
            recipients.ideas = recipients.ideas.map(async idea => await Idea.getIdea(idea)).filter(idea => idea != null)
        })
    user.gifts = user.gifts.map(async gift => await Gift.getGift(gift)).filter(gift => {
        if(gift == null)
            return false;
        return gift.recipientId == null
    })
    user.ideas = user.ideas.map(async idea => await Idea.getIdea(idea)).filter(idea => {
        if(idea == null)
            return false
        return gift.recipientId == null
    })
    return user;
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

module.exports = {getUser, getUserByUsername, addGift, removeGift, addIdea, removeIdea, addRecipient, removeRecipient, removeUser, addUser}