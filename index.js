const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();



// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());

const userRouter=require("./routes/user")
const productRouter=require("./routes/product")
const orderRouter=require("./routes/order")
const cartRouter=require("./routes/cart")
const customerAddressRouter=require("./routes/customerAddress");
const OrdercartRouter=require("./routes/orderCart");

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

main().catch(err => {
  console.log(err);
});

app.use('/users',userRouter.router);
app.use('/products',productRouter.router);
app.use('/orders',orderRouter.router);
app.use('/carts',cartRouter.router);
app.use('/address',customerAddressRouter.router);
app.use('/cartorder',OrdercartRouter.router);
app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});
