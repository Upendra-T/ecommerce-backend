const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerAddressSchema = new Schema({
  uid: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, 
  address: { type: String, required: true },
});

const customerAddress = mongoose.model('Address', customerAddressSchema);

module.exports = customerAddress;
