const express = require("express");
const orderController=require("../controller/order");
const router=express.Router();

router.post('/', orderController.createOrder)
      .get('/user', orderController.fetchOrdersByUser)
      .delete('/:id', orderController.deleteOrder)
      .patch('/:id', orderController.updateOrder)
      .get('/',orderController.fetchAllOrders)


exports.router = router;