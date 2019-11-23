const User = require("../models/user")
const Gift = require("../models/gift")
const Idea = require("../models/idea")
const Recipient = require("../models/recipient")
const {NotFoundError, InvalidRequestError} = require("../errors")

//USER

let getUser = async (id) => {
    return await User.findById(id)
}

let getUserByUsername = async (username, whosAround) => {
    let user = await User.findOne({ username })
    if (!user)
        return null
    user.recipients = await getRecipientListByUser(user._id)
    let totalSpent = user.recipients.map(recipient => {
        let gifts = recipient.gifts || []
        return gifts.map(gift => gift.price).reduce((a, b) => a + b, 0)
    }).reduce((a,b)=>a+b,0).toFixed(2)
    user.recipients = user.recipients.filter(recipient => !whosAround.includes(recipient.name))
    user.gifts = await getGiftsByUserNoRecipient(user._id)
    user.ideas = await getIdeasByUserNoRecipient(user._id)
    let { _id, recipients, gifts, ideas } = user;
    user = { _id, username, recipients, gifts, ideas, totalSpent }
    return user;
}

let addUser = async (req) => {
    let newUser = new User(req)
    await newUser.save()
    return newUser._id
}

let removeUser = async (id) => {
    let user = await getUser(id)
    if (!user)
        throw new NotFoundError("user", `Could not find a user with the id: '${id}'`)
    await removeRecipientByUser(id)
    await removeIdeaByUser(id)
    await removeGiftByUser(id)
    await User.findByIdAndDelete(id)
}

//RECIPIENT

let getRecipient = async (_id) => {
    return await Recipient.findById(_id);
};

let addRecipient = async (req) => {
    let userId = req.userId;
    let user = await getUser(userId)
    if (!user)
        throw new NotFoundError("user", `Failed to find user with the id: '${userId}'`)
    let newRecipient = new Recipient(req)
    await newRecipient.save()
    return newRecipient._id;
};

let editRecipient = async (id, req) => {
    let recipient = await getRecipient(id)
    if(!recipient)
        throw new NotFoundError("recipient", `Failed to find recipient with the id: '${id}'`)
    await Recipient.findByIdAndUpdate(id, req)
}

let removeRecipient = async (id) => {
    let recipient = await getRecipient(id)
    if (!recipient)
        throw new NotFoundError("recipient", `Could not find a recipient with the id: '${id}'`)
    removeRecipientFromGifts(id)
    removeRecipientFromIdeas(id)
    await Recipient.findByIdAndDelete(id)
}

let getRecipientListByUser = async (userId) => {
    let recipients = await Recipient.find({ userId })
    let res = []
    for (let i = 0; i < recipients.length; i++) {
        let recipient = recipients[i]
        recipient.gifts = await getGiftsByRecipient(recipient._id)
        recipient.ideas = await getIdeasByRecipient(recipient._id)
        let { _id, gifts, ideas, name, priceLimit } = recipient
        recipient = { _id, gifts, ideas, name, priceLimit }
        res.push(recipient)
    }
    return res;
}

let removeRecipientByUser = async (userId) => {
    await Recipient.deleteMany({ userId })
}

//GIFT

let getGift = async (id) => {
    return await Gift.findById(id);
}

let addGift = async (req) => {
    const { userId, recipientId } = req;
    let user = await getUser(userId)
    if (!user)
        throw new NotFoundError("user", `A user was not found with the id: '${userId}'`)
    if (recipientId != null) {
        let recipient = await getRecipient(recipientId)
        if (recipient == null)
            throw new NotFoundError("recipient", `A recipient was not found with the id: '${recipientId}'`)
    }
    let newGift = new Gift(req)
    await newGift.save()
    return newGift._id;
}

let editGift = async (id, req) => {
    let gift = await getGift(id)
    if(!gift)
        throw new NotFoundError("gift", `A gift was not found with the id: '${id}'`)
    await Gift.findByIdAndUpdate(id, req)
}

let removeGift = async (id) => {
    let gift = await getGift(id)
    if (!gift)
        throw new NotFoundError("gift", `Could not find a gift with the id: '${id}'`)
    await Gift.findByIdAndDelete(id)
}

let getGiftsByRecipient = async (recipientId) => {
    let gifts = await Gift.find({ recipientId })
    return gifts.map(gift => {
        let { _id, name, price } = gift;
        return { _id, name, price }
    })
}

let getGiftsByUserNoRecipient = async (userId) => {
    let gifts = await Gift.find({ userId, recipientId: null })
    return gifts.map(gift => {
        let { _id, name, price } = gift;
        return { _id, name, price }
    })
}

let removeRecipientFromGifts = async (recipientId) => {
    await Gift.updateMany({ recipientId }, { recipientId: null })
}

let removeGiftByUser = async (userId) => {
    await Gift.deleteMany({ userId })
}

//IDEA

let getIdea = async (_id) => {
    return await Idea.findById(_id);
}

let getIdeasByRecipient = async (recipientId) => {
    let ideas = await Idea.find({ recipientId })
    return ideas.map(idea => {
        let { _id, name, price } = idea;
        return { _id, name, price }
    })
}

let getIdeasByUserNoRecipient = async (userId) => {
    let ideas = await Idea.find({ userId, recipientId: null })
    return ideas.map(idea => {
        let { _id, name, price } = idea;
        return { _id, name, price }
    })
}

let addIdea = async (req) => {
    const { userId, recipientId } = req;
    let user = await getUser(userId)
    if (!user)
        throw new NotFoundError("user", `A user was not found with the id: '${userId}'`)
    if (recipientId != null) {
        let recipient = await getRecipient(recipientId)
        if (recipient == null)
            throw new NotFoundError("recipient", `A recipient was not found with the id: '${recipientId}'`)
    }
    let newIdea = new Idea(req)
    await newIdea.save()
    return newIdea._id;
}

let ideaToGift = async (ideaId, values) => {
    const idea = await Idea.findById(ideaId)
    if (!idea)
        throw new NotFoundError("idea", `An idea was not found with the id: '${ideaId}'`)
    let price = values.price || idea.price
    if(!price){
        throw new InvalidRequestError("Price is required for a gift!")
    }
    const newGift = new Gift({
        name: values.name || idea.name,
        price,
        recipientId: idea.recipientId
    })
    await removeIdea(ideaId)
    await newGift.save()
}

let editIdea = async (id, req) => {
    let idea = await getIdea(id)
    if(!idea)
        throw new NotFoundError("idea", `Failed to find an idea with the id: '${id}'`)
    await Idea.findByIdAndUpdate(id, req)
}

let removeIdea = async (id) => {
    let idea = await getIdea(id)
    if (!idea)
        throw new NotFoundError("idea", `Could not find an idea with the id: '${id}'`)
    await Idea.findByIdAndDelete(id)
}

let removeRecipientFromIdeas = async (recipientId) => {
    await Idea.updateMany({ recipientId }, { recipientId: null })
}

let removeIdeaByUser = async (userId) => {
    await Idea.deleteMany({ userId })
}

module.exports = {
    user: { getUser, getUserByUsername, addUser, removeUser },
    recipient: { getRecipient, addRecipient, editRecipient, removeRecipient },
    gift: { getGift, addGift, editGift, removeGift },
    idea: { getIdea, addIdea, editIdea, removeIdea, ideaToGift }
}

