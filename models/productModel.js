
const { Schema, model } = require("mongoose");
const validator = require("validator");

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: [true, "Email address already exists"],
            validate: [validator.isEmail, "Enter a valid email address."],
        },
        password: {
            type: String,
            required: true,
            minLength: [4, "Password should be at least four characters"],
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
