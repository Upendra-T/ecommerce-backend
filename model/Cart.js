const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  uid: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, 
  products: [
    {
      pid: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, 
      quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
    }
  ],
  totalItems: { type: Number, default: 0, min: [0, 'Total items cannot be negative'] },
  totalPrice: { type: Number, default: 0, min: [0, 'Total price cannot be negative'] },
});

exports.Cart = mongoose.model('Cart', cartSchema);
