const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { buildErrorResponse } = require("../utils/apiResponse");
const { BadRequestError } = require("../utils/errors");
const logger = require("../utils/logger");

const getUserCart = async (userId) => {
  if (!userId) {
    logger.error("Invalid request on getUserCart", { userId });
    throw new BadRequestError("Invalid Request");
  }

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return {
        userId,
        items: [],
        summary: { totalItems: 0, totalPrice: 0 },
      };
    }

    const summary = cart.items.reduce(
      (acc, item) => {
        const itemPrice = item.price || 0;
        acc.totalItems += item.quantity;
        acc.totalPrice += itemPrice * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 },
    );

    const formattedItems = cart.items
      .map((item) => {
        if (!item.productId) return null;

        const productData = item.productId.toObject
          ? item.productId.toObject()
          : item.productId;

        return {
          ...productData,
          quantity: item.quantity,
        };
      })
      .filter(Boolean);

    return {
      _id: cart._id,
      userId: cart.userId,
      items: formattedItems,
      summary,
    };
  } catch (error) {
    logger.error(
      `Unexpected error happend when get user cart ${userId}: ${error.message}`,
    );
    throw error;
  }
};

const addProductCart = async ({ userId, productId, quantity = 0 }) => {
  if (!productId || !userId || !quantity) {
    logger.error(
      "Invalid request on addProductToCart",
      userId,
      productId,
      quantity,
    );
    throw new BadRequestError("Invalid request");
  }

  if (quantity <= 0)
    throw new BadRequestError("Product Quantity must be greater than 0");

  const productData = await Product.findById(productId);
  if (!productData) {
    logger.error(`Product not found`, `productId: ${productId}`);
    throw new BadRequestError("Product not found");
  }
  if (productData.stock < quantity) {
    logger.error(
      `Stock is not ready for product: ${productId}, current stock: ${productData.stock}, requested stock: ${quantity}`,
    );
    throw new BadRequestError("Insufficient stock");
  }

  let userCart = await Cart.findOne({ userId });
  if (!userCart) {
    userCart = new Cart({
      userId,
      items: [{ productId, quantity, price: productData.price }],
    });
  } else {
    logger.info(`Adding new product into ${userId} cart`);
    const existingItem = userCart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      userCart.items.push({ productId, quantity, price: productData.price });
    }
  }

  const savedCart = await userCart.save();
  if (!savedCart) {
    logger.error(
      "Failed to save or update user cart",
      `userId: ${userId}`,
      `productId: ${productId}`,
      `quantity: ${quantity}`,
    );
    throw new BadRequestError("Failed to save user cart");
  }
};

const removeProductCart = async ({ userId, productId }) => {
  if (!userId || !productId) {
    logger.error("Invalid request on removeProductCart", { userId, productId });
    throw new BadRequestError("Invalid request");
  }

  const userCart = await Cart.findOne({ userId });
  if (!userCart) {
    logger.error(`Cart not found for user: ${userId}`);
    throw new BadRequestError("Cart not found");
  }

  const itemExists = userCart.items.some(
    (item) => item.productId.toString() === productId.toString(),
  );

  if (!itemExists) {
    logger.error(`Product ${productId} not found in user ${userId}'s cart`);
    throw new BadRequestError("Product not found in cart");
  }

  logger.info(`Removing product ${productId} from ${userId}'s cart`);
  userCart.items = userCart.items.filter(
    (item) => item.productId.toString() !== productId.toString(),
  );

  const savedCart = await userCart.save();
  if (!savedCart) {
    logger.error("Failed to save cart after removing product", {
      userId,
      productId,
    });
    throw new BadRequestError("Failed to update user cart");
  }

  return savedCart;
};

module.exports = { addProductCart, getUserCart, removeProductCart };
