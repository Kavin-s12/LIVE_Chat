const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const generateToken = require("../config/generateToken");

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please Enter all Feilds");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, password, email, picture } = req.body;

  if (!name || !password || !email) {
    res.status(400);
    throw new Error("Please Enter all Feilds");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  const createUser = await User.create({
    name,
    password,
    email,
    picture,
  });

  if (createUser) {
    res.status(201).send({
      _id: createUser._id,
      name: createUser.name,
      email: createUser.email,
      picture: createUser.picture,
      token: generateToken(createUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

const searchUser = asyncHandler(async (req, res) => {
  const search = req.query.search;

  const keyword = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");

  res.send(users);
});

module.exports = { authUser, registerUser, searchUser };
