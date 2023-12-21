const express = require("express");
const cartController=require("../controller/cart");
const router = express.Router();

router.post('/', cartController.addToCart)
      .get('/', cartController.fetchCartByUser)
      .delete('/', cartController.deleteFromCart)
      .patch('/', cartController.updateCart)

exports.router = router;