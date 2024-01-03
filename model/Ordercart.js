const mongoose = require('mongoose');
const { Schema } = mongoose;// Adjust the path based on your actual file structure

const ordercartSchema = new Schema({
  cid: { type: Schema.Types.ObjectId, required: true, ref: 'Cart' },
  pid: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  uid: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  ptitle:{type:String},
  pthumbnail:{type:String},
  quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
  totalPrice: { type: Number, required: true, min: [0, 'Total price cannot be negative'] },
  address: { type: String, required: true },
  orderDate: { type: Date, default: Date.now }
});

exports.Ordercart = mongoose.model('Ordercart', ordercartSchema);
