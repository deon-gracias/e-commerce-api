const createError = require("http-errors");
const { generateToken } = require("../lib/auth");
const User = require("../models/userModel");

async function getAllUsers(req, res, next) {
  const users = await User.find({});

  return res.status(200).json(users);
}

async function getUserById(req, res, next) {
  const user = await User.findById(req.params.id);

  if (!user) return next(createError(404, "User id not found"));

  delete user.password;
  return res.status(201).send(user);
}

async function deleteUserById(req, res, next) {
  const user = await User.findByIdAndDelete(req.body._id);

  if (!user) return next(createError(404, "User id not found"));

  delete user.password;
  return res.status(200).send(user);
}

async function signIn(req, res, next) {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(createError(401, "Invalid User Credentials"));

  console.log(user);

  delete user.password;
  return res.status(200).send({
    ...user.toObject({ versionKey: false }),
    token: generateToken({
      name: user.name,
      email: user.email,
    }),
  });
}

async function signUp(req, res, next) {
  const user = await User.findOne({ email: req.body.email });
  if (user) return next(createError(404, "User already exists"));

  const createdUser = await new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }).save();

  return res.status(201).send({
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
  });
}

module.exports = { getAllUsers, getUserById, signIn, signUp, deleteUserById };
