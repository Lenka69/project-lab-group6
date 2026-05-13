const winston = require("winston");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "dev";
  return env === "dev" ? "debug" : "info";
};

const logFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";

    return `[${timestamp}] [${level}]: ${message} ${metaString}`.trim();
  }),
);

const transports = [
  new winston.transports.Console({
    format: logFormat,
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  logFormat,
  transports,
});

module.exports = logger;
