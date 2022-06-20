const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Make sure you don't hash the hash
  if (!this.isModified("password")) return next();

  bcrypt.hash(this.password, process.env.SALT_FACTOR || 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
  });
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
