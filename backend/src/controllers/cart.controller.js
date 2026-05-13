const cartService = require("../services/cart.service");
const { sendSuccess } = require("../utils/apiResponse");
const logger = require("../utils/logger");

const addProductCart = async (req, res, next) => {
  try {
    await cartService.addProductCart(req.body);
    sendSuccess(res);
  } catch (err) {
    logger.error(
      "Error happened when user tried to add product to cart",
      err.message,
    );
    next(err);
  }
};

const getUserCart = async (req, res, next) => {
  try {
    const cart = await cartService.getUserCart(req.params.userId);
    sendSuccess(res, cart);
  } catch (err) {
    logger.error("Error happened when get user cart", err.message);
    next(err);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    await cartService.removeProductCart(req.body);
    sendSuccess(res);
  } catch (err) {
    logger.error(
      "Error happened when user tried to add product to cart",
      err.message,
    );
    next(err);
  }
};

module.exports = { addProductCart, getUserCart, removeProduct };
