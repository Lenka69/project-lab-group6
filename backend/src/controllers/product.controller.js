const productService = require("../services/product.service");
const { sendSuccess } = require("../utils/apiResponse");
const logger = require("../utils/logger");

const create = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    sendSuccess(res, product, "Product Created", 201);
  } catch (err) {
    logger.error("Error happened when creating new product", err.message);
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const product = await productService.getAllProducts();
    sendSuccess(res, product);
  } catch (err) {
    logger.error("Error happened when get list products", err.message);
    next(err);
  }
};

const getPopular = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const product = await productService.getPopularProducts(limit);
    sendSuccess(res, product);
  } catch (err) {
    logger.error("Error happened when get popular products", err.message);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    sendSuccess(res, product);
  } catch (err) {
    logger.error("Error happened when update product", err.message);
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    sendSuccess(res, product);
  } catch (err) {
    logger.error("Error happened when delete product", err.message);
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id);
    sendSuccess(res, product);
  } catch (err) {
    logger.error("Error happened when get product by id", err.message);
    next(err);
  }
};

module.exports = { create, getAll, getPopular, update, remove, getById };
