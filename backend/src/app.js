require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB, seedProductData, seedUserData } = require("./config/db");

// Routes
const productRoute = require("./routers/product.route");
const authRoute = require("./routers/auth.route");
const cartRoute = require("./routers/cart.route");
const transactionRoute = require("./routers/transaction.route");

// Middlewares
const authMiddleware = require("./middlewares/auth.middleware");
const errorHandler = require("./middlewares/error.middleware");
const requestLogger = require("./middlewares/request.middleware");

const app = express();

const start = async () => {
  await connectDB();
  await seedProductData();
  await seedUserData();

  // Middleware for loggin every incomeinghttp request
  app.use(requestLogger);
  app.use(express.json());
  app.use(cors({ origin: process.env.ALLOWED_DOMAIN, credentials: true }));

  // Protected Routes
  app.use("/products", authMiddleware, productRoute);
  app.use("/cart", authMiddleware, cartRoute);
  app.use("/transactions", authMiddleware, transactionRoute);

  // Public Routes
  app.use("/auth", authRoute);

  // Middleware to handle the error http responses
  app.use(errorHandler);

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

start();
