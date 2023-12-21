const express = require("express");
const orderController=require("../controller/order");
const router=express.Router();

//  /orders is already added in base path
router.post('/', orderController.createOrder)
     // .post('/cart', orderController.createCartOrder)
      .get('/user', orderController.fetchOrdersByUser)
      .delete('/:id', orderController.deleteOrder)
      .patch('/:id', orderController.updateOrder)
      .get('/',orderController.fetchAllOrders)


exports.router = router;