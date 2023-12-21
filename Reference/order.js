const model= require("../model/Order");
const Order=model.Order;

// Create a new order
const { Product } = require('../model/Product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { pid, uid, quantity } = req.body;

    // Retrieve product details to calculate total price and update stock
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if there is enough stock to fulfill the order
    if (quantity > product.stock) {
      return res.status(400).json({ error: 'Insufficient stock for this product' });
    }

    const totalPrice = quantity * product.price;

    // Create a new order
    const newOrder = new Order({
      pid,
      uid,
      quantity,
      totalPrice,
    });
    // Update product stock

    product.stock -= quantity;

    await product.save();

    await newOrder.save();

    res.status(201).json({ order: newOrder, message: 'Order created successfully' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch orders for a specific user
exports.fetchOrdersByUser = async (req, res) => {
  try {
    const { uid } = req.query;

    // Fetch orders for the specified user
    const orders = await Order.find({ uid });

    res.json({ orders });
  } catch (error) {
    console.error('Fetch orders by user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the specified order
    await Order.findByIdAndDelete(id);

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Update the specified order
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

// Fetch all orders
exports.fetchAllOrders = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find();

    res.json({ orders });
  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
