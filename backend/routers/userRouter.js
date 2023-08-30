const express = require("express");
const {
  authUser,
  registerUser,
  searchUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.route("/").post(registerUser).get(protect, searchUser);
userRouter.route("/login").post(authUser);

module.exports = userRouter;
