
const model= require("../model/Product");
const Product=model.Product;
exports.createProduct = async(req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: "Error saving product" });
  }
 };
exports.getAllProducts = async(req, res) => {
   const products=await Product.find();
   res.json(products);
};
exports.getProduct = async(req, res) => {
  console.log(typeof(parseInt(req.params.id)));
  const products=await Product.find({"id":parseInt(req.params.id)});
  res.json(products);
};

exports.replaceProduct = async(req, res) => {
  const products=await Product.updateOne({"id":parseInt(req.params.id)},req.body);
  await res.json(products);
};
exports.updateProduct = async(req, res) => {
  const products=await Product.updateOne({"id":parseInt(req.params.id)},{$set:req.body});
  await res.json(products);
};
exports.deleteProduct = async(req, res) => {
  console.log(req.params.id);
  const products=await Product.deleteOne({"id":parseInt(req.params.id)});
  res.json(products);
};
