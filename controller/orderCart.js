const model = require("../model/Ordercart");
const Order = model.Ordercart; 

const { Product } = require('../model/Product');
const { Cart } = require('../model/cart');
const { User } = require('../model/User');

exports.createCartOrder = async (req, res) => {
  try {
    const { uid } = req.body;
    const cart = await Cart.findOne({ uid });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const createdOrders = [];
    for (const cartProduct of cart.products) {
      const product = await Product.findById(cartProduct.pid);
      if (!product)
       {
        return res.status(404).json({ error: `Product not found for ID: ${cartProduct.pid}` });
      }

      if (cartProduct.quantity > product.stock) {
        return res.status(400).json({ error: `Insufficient stock for product with ID: ${cartProduct.pid}` });
      }

      const totalPrice = cartProduct.quantity * product.price;
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newOrder = new Order({
        cid: cart._id,
        pid: cartProduct.pid,
        uid,
        quantity: cartProduct.quantity,
        totalPrice,
        address: user.address,
      });
      await newOrder.save();
      product.stock -= cartProduct.quantity;
      await product.save();
      createdOrders.push(newOrder);
    }
    cart.products = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();
    res.status(201).json({ orders: createdOrders, message: 'Orders created successfully' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
