import Message from "../models/messageModel.js"
import Chat from "../models/chatModel.js"
import User from "../models/userModel.js"



  
  //@description     Get all Messages
  //@route           GET /api/Message/:chatId
  //@access          Protected
  export const allMessages =async (req, res) => {
    
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "username pic email")
        .populate("chat");
      
       res.status(200).send({
        success: true,
        message: "got message succefully",
        allmessages:messages
      });
      
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };
  
  //@description     Create New Message
  //@route           POST /api/Message/
  //@access          Protected
  export const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
    
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      var message = await Message.create(newMessage);
  
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      
      res.status(200).send({
        success: true,
        message: "send message succefully",
        messageinfo:message
      });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };

 
 