const { Schema, model } = require("mongoose");

const variantSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
});

const reviewSchema = new Schema(
  {
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
    },
    category: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
    },
    variants: { type: [variantSchema], default: [] },
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
