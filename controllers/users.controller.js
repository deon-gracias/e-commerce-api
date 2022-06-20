const createError = require("http-errors");
const User = require("../models/userModel");

exports.getAllUsers = async function (req, res, next) {
  const users = await User.find({});
  return res.status(200).json(users);
};

exports.getUserById = async function (req, res, next) {};

exports.deleteUserById = async function (req, res, next) {
  const user = await User.findByIdAndDelete(req.body._id);

  if (user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json(user);
};

exports.signIn = async function (req, res, next) {};

exports.signUp = async function (req, res, next) {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const createdUser = await user.save().catch((err, user) => {
    if (err) return next(createError(406, err));

    return res.status(201).send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
    });
  });
};
