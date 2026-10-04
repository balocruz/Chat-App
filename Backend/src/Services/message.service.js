import Message from "../models/message.model.js"
import Conversation from "../models/conversation.model.js"
import {verifyUser} from "../middleware/auth.middleware.js"

const createMessage =async ({conversation,sender,receiver,content})=>{
    const conversationData = await Conversation.findById(conversation)
    if(!conversationData){
        throw new Error("Conversation not found");
    }
    const isParticipant = conversationData.participants.some(participant => participant.toString() === sender)
    if(!isParticipant){
        throw new Error("Sender is not a participant of the conversation");
    }
    receiver = conversationData.participants.find(participant => participant.toString() !== sender)
    const message = await Message.create({
        conversation,sender,receiver,content
    })
    return message
}

const getConversation = async (conversationId) => {
    const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 })
    return messages
}

export { createMessage, getConversation }