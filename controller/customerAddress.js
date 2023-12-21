const Address = require('../model/customerAddress'); 

exports.addAddress = async (req, res) => {
  try {
    const { uid, address, postalCode, country } = req.body;
    const newAddress = new Address({
      uid,
      address,
      postalCode,
      country,
    });
    const savedAddress = await newAddress.save();
    res.status(201).json({ address: savedAddress, message: 'Address added successfully' });
  } 
  catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.fetchUserAddress = async (req, res) => {
  try {
    const { uid } = req.body;
    const userAddresses = await Address.find({ uid });
    res.status(200).json({ addresses: userAddresses });
  }
   catch (error) {
    console.error('Fetch user addresses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } 
  catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const { addressId, updatedData } = req.body;
    const updatedAddress = await Address.findByIdAndUpdate(addressId, updatedData, { new: true });
    if (!updatedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.status(200).json({ address: updatedAddress, message: 'Address updated successfully' });
  } 
  catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
