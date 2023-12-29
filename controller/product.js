const { Product } = require('../model/Product');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      discountPercentage,
      rating,
      brand,
      category,
      thumbnail,
    } = req.body;

    const images = req.files.map((file) => file.buffer.toString('base64'));

    const product = new Product({
      title,
      description,
      price,
      stock,
      discountPercentage,
      rating,
      brand,
      category,
      thumbnail,
      images,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: 'Error saving product' });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getSearchedProduct = async (req, res) => {
  const { category, title } = req.params;

  try {
    let query = {};

    if (category.toLowerCase() !== 'all') {
      query.category = category;
    }

    query.title = { $regex: title, $options: 'i' };

    const products = await Product.find(query);

    res.json(products);
  } catch (error) {
    console.error('Error fetching searched products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProductCategories = async (req, res) => {
  const products = await Product.find({ "category": (req.params.category) });
  res.json(products);
};

exports.replaceProduct = async (req, res) => {
  const products = await Product.updateOne({ "id": parseInt(req.params.id) }, req.body);
  await res.json(products);
};

exports.updateProduct = async (req, res) => {
  const products = await Product.updateOne({ "id": parseInt(req.params.id) }, { $set: req.body });
  await res.json(products);
};

exports.deleteProduct = async (req, res) => {
  console.log(req.params.id);
  const products = await Product.deleteOne({ "id": parseInt(req.params.id) });
  res.json(products);
};
