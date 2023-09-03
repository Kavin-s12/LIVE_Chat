const asyncHandler = require("express-async-handler");
const Message = require("../Models/MessageModel");
const User = require("../Models/UserModel");
const Chat = require("../Models/ChatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.statusCode(400);
  }
  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  let message = await Message.create(newMessage);
  message = await message.populate("sender", "name picture");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "name picture email",
  });
  await Chat.findByIdAndUpdate(chatId, {
    lastestMessage: message,
  });
  res.send(message);
});

const allMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name picture email")
    .populate("chat");

  res.send(messages);
});

module.exports = { sendMessage, allMessages };
