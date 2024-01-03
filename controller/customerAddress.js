const CustomerAddress = require('../model/customerAddress'); 
const jwt = require('jsonwebtoken');
const secretKey = "f811b7889e175938b2906e3d68cc0363"; 
exports.addAddress = async (req, res) => {
  try {
    const { uid, address } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    if (decoded.userId !== uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const newAddress = new CustomerAddress({
      uid,
      address,
    });
    const savedAddress = await newAddress.save();
    res.status(201).json({ address: savedAddress, message: 'Address added successfully' });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.fetchUserAddress = async (req, res) => {
  try {
    const { uid } = req.query;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    if (decoded.userId !== uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userAddresses = await CustomerAddress.find({ uid });
    console.log(userAddresses);
    res.status(200).json({ addresses: userAddresses });
  } catch (error) {
    console.error('Fetch user addresses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const deletedAddress = await CustomerAddress.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId, updatedData } = req.body;
    const updatedAddress = await CustomerAddress.findByIdAndUpdate(addressId, updatedData, { new: true });
    if (!updatedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.status(200).json({ address: updatedAddress, message: 'Address updated successfully' });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
