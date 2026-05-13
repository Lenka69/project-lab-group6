const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

router.post("/checkout", transactionController.checkoutCart);
router.get("/:userId", transactionController.getTransactionHistory);

module.exports = router;
