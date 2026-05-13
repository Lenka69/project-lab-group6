const transactionHistoryService = require("../services/transaction.service");
const { sendSuccess } = require("../utils/apiResponse");
const logger = require("../utils/logger");

const checkoutCart = async (req, res, next) => {
  try {
    await transactionHistoryService.checkout(req.body);
    sendSuccess(res);
  } catch (err) {
    logger.error(
      "Error happened when user tried to add product to cart",
      err.message,
    );
    next(err);
  }
};

const getTransactionHistory = async (req, res, next) => {
  try {
    const transactions = await transactionHistoryService.getTransactionHistory(
      req.params.userId,
    );
    sendSuccess(res, transactions);
  } catch (err) {
    logger.error(
      "Error happened when user tried to add product to cart",
      err.message,
    );
    next(err);
  }
};

module.exports = { checkoutCart, getTransactionHistory };
