const express = require("express");
const productController = require("../controller/product");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .get("/", productController.getAllProducts)
  .get("/prod/:category/:title", productController.getSearchedProduct)
  .get("/:category", productController.getProductCategories) 
  .post("/", upload.array('images', 5), productController.createProduct)
  .post("/product",productController.createProducts)
  .put("/:id", productController.replaceProduct)
  .patch("/:id", productController.updateProduct)
  .delete("/:id", productController.deleteProduct);

exports.router = router;
