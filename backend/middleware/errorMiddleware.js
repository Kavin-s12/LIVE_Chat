const { model } = require("mongoose");

const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Page Not Found : ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode).send({
    message: err.message,
    stack: process.env.NODE_ENV == "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
