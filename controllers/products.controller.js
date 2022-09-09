const createError = require("http-errors");
const Product = require("../models/productModel");

/*
 * Get all products
 */
async function getAllProducts(req, res, next) {
  const products = await Product.find({});

  return res.status(200).json(products);
}

/*
 * Get product by id
 */
async function getProductById(req, res, next) {
  const product = await Product.findById(req.params.id);

  if (!product) return next(createError(404, "Product not found"));

  return res.status(200).json(product);
}

/*
 * Created Product
 */
async function createProduct(req, res, next) {
  const createdProduct = await new Product({
    name: req.body.name,
    description: req.body.description || "",
    price: req.body.price,
    category: req.body.category,
    images: req.body.images,
    quantity: req.body.quantity,
    variants: req.body.variants,
  }).save();

  return res.status(201).send(createdProduct);
}

/*
 * Delete product by id
 */
async function deleteProductById(req, res, next) {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) return next(createError(404, "Couldn't Find Product"));

  return res.status(200).send(deletedProduct);
}

/*
 * Update product by id
 */
async function updateProductById(req, res, next) {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updatedProduct) return next(createError(404, "Couldn't Find Product"));

  return res.status(200).send(updatedProduct);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  updateProductById,
};
