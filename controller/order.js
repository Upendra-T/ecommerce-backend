const model= require("../model/Order");
const Order=model.Order;
const { Product } = require('../model/Product');
const { Ordercart } = require('../model/Ordercart');
const { User } = require('../model/User');
const jwt = require('jsonwebtoken');
const secretKey = "f811b7889e175938b2906e3d68cc0363"; 
exports.createOrder = async (req, res) => {
  try {
    const { pid, uid, quantity,address } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    if (decoded.userId !== uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ error: 'Insufficient stock for this product' });
    }

    const totalPrice = quantity * product.price;
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newOrder = new Order({
      pid,
      uid,
      ptitle: product.title,        
      pthumbnail: product.thumbnail, 
      quantity,
      totalPrice,
      address,
      orderDate: new Date(),
    });

    product.stock -= quantity;
    await product.save();
    await newOrder.save();

    res.status(201).json({ order: newOrder, message: 'Order created successfully' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.fetchOrdersByUser = async (req, res) => {
  try {
    const { uid } = req.query;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    if (decoded.userId !== uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ordersFromOrderModel = await Order.find({ uid });
    const ordersFromOrdercartModel = await Ordercart.find({ uid });

    const allOrders = [...ordersFromOrderModel, ...ordersFromOrdercartModel];

    res.json({ orders: allOrders });
  } catch (error) {
    console.error('Fetch orders by user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: 'Order deleted successfully' });
  } 
  catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    res.json({ order: updatedOrder, message: 'Order updated successfully' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.fetchAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ orders });
  } 
  catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

