const Idea = require("../models/idea")
const Recipient = require("./recipient")
const User = require("./user")

let getIdea = async (_id) => {
    return await Idea.findById(_id);
}

let addIdea = async (req) => {
    const { userId, recipientId } = req;
    let user = await User.getUser(userId)
    if (!user)
        throw new Error(`A user was not found with the id: '${userId}'`)
    let newIdea = new Idea(req)
    if(recipientId)
        await Recipient.addIdea(recipientId, newIdea._id)
    await User.addIdea(userId, newIdea._id)
    await newIdea.save()
    return newIdea._id;
}

let editIdea = async (id, req) => {
    await Idea.findByIdAndUpdate(id, req)
}

let removeIdea = async (id) => {
    let idea = await getIdea(id)
    if(!idea)
        throw new Error(`Could not find an idea with the id: '${id}'`)
    let {recipientId, userId} = idea
    await User.removeIdea(userId, id)
    await Recipient.removeIdea(recipientId, id)
    await Idea.findByIdAndDelete(id)
}

let getIdeasByRecipient = async (recipientId) => {
    return await Idea.find({ recipientId })
}

let removeRecipientId = async (recipientId) => {
    await Idea.updateMany({recipientId}, {recipientId: null})
}

let removeByUser = async (userId) => {
    await Idea.deleteMany({userId})
}

module.exports = { getIdea, addIdea, editIdea, removeIdea, getIdeasByRecipient, removeRecipientId, removeByUser }