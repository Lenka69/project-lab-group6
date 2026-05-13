const { AppError } = require("../utils/errors.js");
const { sendError } = require("../utils/apiResponse.js");
const logger = require("../utils/logger.js");

const errorHandler = (err, req, res, next) => {
  const meta = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id ?? null,
  };

  if (err instanceof AppError) {
    logger.error(`Error happened: ${err.message}`, {
      ...meta,
      statusCode: err.statusCode,
    });
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  logger.error(`Unexpected error happened: ${err.message}`, {
    ...meta,
    stack: err.stack,
  });
  return sendError(res, "Internal server error", 500);
};

module.exports = errorHandler;
