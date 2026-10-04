import Message from "../models/message.model.js";
import {getConversation} from "../Services/message.service.js"

const createMessage = async (req, res) => {
  try {
    const { conversation, sender, receiver, content } = req.body;
    const message = await Message.create({
      conversation,
      sender,
      receiver,
      content,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Message created successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create message",
        error: error.message,
      });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const message = await getConversation(conversationId)
    res.status(200).json({ message: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createMessage ,getMessages};
