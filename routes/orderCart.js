const express = require("express");
const ordercartController=require("../controller/orderCart");
const router=express.Router();
router .post('/cart', ordercartController.createCartOrder);


exports.router = router;