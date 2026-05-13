const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/add-product", cartController.addProductCart);
router.get("/:userId", cartController.getUserCart);
router.patch("/remove-product", cartController.removeProduct);

module.exports = router;
