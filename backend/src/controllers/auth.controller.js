const authService = require("../services/auth.service");
const { sendSuccess } = require("../utils/apiResponse");
const logger = require("../utils/logger");

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    sendSuccess(res, user, "User Created", 201);
  } catch (err) {
    logger.error("Error happened when user tried to register", err.message);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result);
  } catch (err) {
    logger.error("Error happened when user tried to login", err.message);
    next(err);
  }
};

module.exports = { register, login };
