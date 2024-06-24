const ErrorHandler = require("../utils/ErrorHandler");
const errMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //wromg mongodb id error
  if (err.message === "CastError") {
    const message = `resource not found.Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //wrong mongo error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt error

  if (err.name === "JsonWebTokenError") {
    const message = `Invalid jwt .Try again`;
    err = new ErrorHandler(message, 400);
  }

  //jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = `Expired jwt .Try again`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
module.exports = errMiddleware;
