const model= require("../model/Order");
const Order=model.Order;
const { Product } = require('../model/Product');
const { User } = require('../model/User');
exports.createOrder = async (req, res) => {
  try {
    const { pid, uid, quantity } = req.body;
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
      quantity,
      totalPrice,
      address: user.address, 
    });

    product.stock -= quantity;
    await product.save();
    await newOrder.save();
    res.status(201).json({ order: newOrder, message: 'Order created successfully' });
  } 
  catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.fetchOrdersByUser = async (req, res) => {
  try {
    const { uid } = req.query;
    const orders = await Order.find({ uid });
    res.json({ orders });
  }
   catch (error) {
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

