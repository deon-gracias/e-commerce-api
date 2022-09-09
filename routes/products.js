const {
  getAllProducts,
  getProductById,
  deleteProductById,
  updateProductById,
  createProduct,
} = require("../controllers/products.controller");
const router = require("express").Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.delete("/:id", deleteProductById);
router.put("/:id", updateProductById);

module.exports = router;
