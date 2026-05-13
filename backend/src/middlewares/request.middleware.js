// requestLogger.js
const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const message = `Incoming Request: ${req.method} ${req.originalUrl}`;

  const meta = {
    ip: req.ip,
  };

  logger.info(message, meta);

  next();
};

module.exports = requestLogger;
