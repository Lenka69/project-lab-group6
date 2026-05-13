const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const logger = require("../utils/logger");
const { BadRequestError } = require("../utils/errors");

const checkout = async ({ userId }) => {
  if (!userId) {
    logger.error("Invalid request on checkout", { userId });
    throw new BadRequestError("Invalid request");
  }

  const userCart = await Cart.findOne({ userId }).populate("items.productId");

  if (!userCart || userCart.items.length === 0) {
    throw new BadRequestError("Cart is empty. Add items before checking out.");
  }

  let totalAmount = 0;
  const transactionItems = [];

  for (const item of userCart.items) {
    const product = item.productId;

    if (!product) {
      throw new BadRequestError("A product in your cart no longer exists.");
    }

    if (product.stock < item.quantity) {
      logger.warn(`Checkout failed: Insufficient stock for ${product.name}`);
      throw new BadRequestError(
        `Sisa stok untuk ${product.name} tidak mencukupi (Tersisa: ${product.stock}).`,
      );
    }

    totalAmount += product.price * item.quantity;

    transactionItems.push({
      productId: product._id,
      name: product.name,
      img: product.img,
      price: product.price,
      quantity: item.quantity,
    });
  }

  for (const item of userCart.items) {
    const product = item.productId;
    product.stock -= item.quantity;
    product.sold = (product.sold || 0) + item.quantity;
    await product.save();
  }

  const newTransaction = new Transaction({
    userId,
    items: transactionItems,
    totalAmount,
  });

  const savedTransaction = await newTransaction.save();

  userCart.items = [];
  await userCart.save();

  logger.info(
    `Successful checkout for user ${userId}. Transaction ID: ${savedTransaction._id}`,
  );

  await Cart.findOneAndDelete({ userId });

  return savedTransaction;
};

const getTransactionHistory = async (userId) => {
  if (!userId) {
    logger.error("Invalid request on getTransactionHistory", { userId });
    throw new BadRequestError("Invalid request");
  }

  try {
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });

    return transactions;
  } catch (error) {
    logger.error(
      `Failed to fetch transaction history for user ${userId}: ${error.message}`,
    );
    throw error;
  }
};

module.exports = {
  checkout,
  getTransactionHistory,
};
