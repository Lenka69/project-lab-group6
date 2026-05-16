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

const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.replace(/\/$/, "");
};

const allowedOrigins = (process.env.ALLOWED_DOMAIN || "http://localhost:5173")
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow request tanpa origin, misalnya dari Postman, mobile app, atau server-to-server
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS blocked for origin: ${normalizedOrigin}`)
    );
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend healthy",
    allowedOrigins,
  });
});

// Public Routes
app.use("/auth", authRoute);

// Protected Routes
app.use("/products", authMiddleware, productRoute);
app.use("/cart", authMiddleware, cartRoute);
app.use("/transactions", authMiddleware, transactionRoute);

// Error Handler
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    await seedProductData();
    await seedUserData();

    const PORT = process.env.PORT || 10000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();