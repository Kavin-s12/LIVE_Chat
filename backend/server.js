const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

const app = express();

dotenv.config();
connectDB();

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(_dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"))
  );
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on port ${port}`));
