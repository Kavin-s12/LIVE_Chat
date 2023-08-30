const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decode.id).select("-password");

      next();
    } catch (e) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
