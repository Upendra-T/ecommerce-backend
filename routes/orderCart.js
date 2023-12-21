const express = require("express");
const ordercartController=require("../controller/orderCart");
const router=express.Router();

//  /orders is already added in base path
router .post('/cart', ordercartController.createCartOrder);


exports.router = router;