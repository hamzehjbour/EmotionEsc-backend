import AppError from "../utils/AppError.mjs";

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;

  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");

  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError("Invalid token please login again!", 401);

const handleExpiredJwt = () =>
  new AppError("Your token has expired please login again!", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.log("ERROR 💥", err);

  return res.status(err.statusCode).json({
    status: "error",
    message: "Something went wrong. Please try again later",
  });
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error;

    if (err.name === "CastError") error = handleCastErrorDB(err);
    else if (err.name === "ValidationError")
      error = handleValidationErrorDB(err);
    else if (err.name === "JsonWebTokenError") error = handleJwtError(err);
    else if (err.name === "TokenExpiredError") error = handleExpiredJwt(err);
    else if (err.code === 11000) error = handleDuplicateFieldsDB(err);

    sendErrorProd(error, res);
  }
};
