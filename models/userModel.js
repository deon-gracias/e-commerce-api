const { Schema, model } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema(
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
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
