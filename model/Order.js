const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../model/User'); // Adjust the path based on your actual file structure

const orderSchema = new Schema({
  pid: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  uid: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
  totalPrice: { type: Number, required: true, min: [0, 'Total price cannot be negative'] },
  address: { type: String, required: true },
  orderDate: { type: Date, default: Date.now }
});


exports.Order = mongoose.model('Order', orderSchema);
