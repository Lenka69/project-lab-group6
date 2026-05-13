const Product = require("../models/Product");
const { BadRequestError } = require("../utils/errors");
const logger = require("../utils/logger");

const create = async (data) => {
  const product = new Product(data);
  return await product.save();
};

const getAllProducts = async () => {
  return await Product.find();
};

const getPopularProducts = async (limit = 5) => {
  return await Product.find().sort({ ssold: -1 }).limit(limit);
};

const getById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    logger.error(`Product is not found with id: ${id}`);
    throw new BadRequestError("Product not found");
  }

  return product;
};

const update = async (id, data) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updatedProduct) {
    logger.error(`Product with id: ${id} is not found`);
    throw new BadRequestError("Product not found");
  }

  return updatedProduct;
};

const deleteProduct = async (id) => {
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    logger.error(`Product with id: ${id} is not found`);
    throw new BadRequestError("Product not found");
  }

  return deletedProduct;
};

module.exports = {
  create,
  getAllProducts,
  getPopularProducts,
  update,
  deleteProduct,
  getById,
};
