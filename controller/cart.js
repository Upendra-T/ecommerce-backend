// cart controller

const { Cart } = require('../model/cart');
const { Product } = require('../model/Product');
const { User } = require('../model/User');

exports.addToCart = async (req, res) => {
  try {
    const { pid, uid, quantity } = req.body;
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let cart = await Cart.findOne({ uid });

    if (!cart) {
      cart = new Cart({
        uid,
        products: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }
    const existingProduct = cart.products.find((item) => item.pid.equals(pid));
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } 
    else {
      cart.products.push({
        pid,
        quantity,
      });
    }
    cart.totalItems += quantity;
    cart.totalPrice += quantity * product.price;
    await cart.save();

    res.status(201).json({ cart, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.fetchCartByUser = async (req, res) => {
  try {
    const { uid } = req.query;
    const cartItems = await Cart.find({ uid });
    res.json({ cartItems });
  } 
  catch (error) {
    console.error('Fetch cart by user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteFromCart = async (req, res) => {
  try {
    const { uid, pid } = req.body;
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let cart = await Cart.findOne({ uid });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const productIndex = cart.products.findIndex((item) => item.pid.equals(pid));
    if (productIndex !== -1) {
      const deletedProduct = cart.products.splice(productIndex, 1)[0];
      const product = await Product.findById(deletedProduct.pid);

      if (product) {
        cart.totalItems -= deletedProduct.quantity;
        cart.totalPrice -= deletedProduct.quantity * product.price;
        await cart.save();
        return res.json({ cart, message: 'Product deleted from cart successfully' });
      } else {
        return res.status(404).json({ error: 'Product not found' });
      }
    } else {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }
  } catch (error) {
    console.error('Delete from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateCart = async (req, res) => {
  try {
    const { uid, pid, quantity } = req.body;
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let cart = await Cart.findOne({ uid });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const productIndex = cart.products.findIndex((item) => item.pid.equals(pid));

    if (productIndex !== -1) {
      const existingProduct = cart.products[productIndex];
      const product = await Product.findById(existingProduct.pid);
      if (!product || quantity > product.stock) {
        return res.status(400).json({ error: 'Invalid quantity or insufficient stock' });
      }
      const quantityDifference = quantity - existingProduct.quantity;
      existingProduct.quantity = quantity;
      cart.totalItems += quantityDifference;
      cart.totalPrice += quantityDifference * product.price;
      await cart.save();
      return res.json({ cart, message: 'Cart updated successfully' });
    } 
    else {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }
  } 
  catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

