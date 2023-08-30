const asyncHandler = require("express-async-handler");
const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId params is empty");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastestMessage");

  isChat = await User.populate(isChat, {
    path: "lastestMessage.sender",
    select: "name email picture",
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      users: [req.user._id, userId],
      isGroupChat: false,
    };

    try {
      const createChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  const chat = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("lastestMessage")
    .sort({ updatedAt: -1 })
    .then(async (result) => {
      result = await User.populate(result, {
        path: "lastestMessage.sender",
        select: "name email picture",
      });

      res.status(200).send(result);
    });
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(200).send({ message: "please fill the fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    res.status(400).send("More than 2 users are required to form a group");
  }

  users.push(req.user);

  const groupChat = await Chat.create({
    chatName: req.body.name,
    users,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).send(fullGroupChat);
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatName, chatId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.send(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  const addedUser = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedUser) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.send(addedUser);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  const removedUser = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removedUser) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.send(removedUser);
  }
});
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
