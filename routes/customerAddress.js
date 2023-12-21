const express = require("express");
const customerAddressController=require("../controller/customerAddress");
const router = express.Router();

router.post('/', customerAddressController.addAddress)
      .get('/', customerAddressController.fetchUserAddress)
      .delete('/', customerAddressController.deleteAddress)
      .patch('/', customerAddressController.updateAddress)

exports.router = router;