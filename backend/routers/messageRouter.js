const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");

const messageRouter = express.Router();

messageRouter.route("/").post(protect, sendMessage);
messageRouter.route("/:chatId").get(protect, allMessages);

module.exports = messageRouter;
