const createError = require("http-errors");
const { generateAccessToken } = require("../lib/auth");
const User = require("../models/userModel");

/**
 * Get all users
 */
async function getAllUsers(req, res, next) {
  const users = await User.find({});

  return res.status(200).json(users);
}

/**
 * Get user by id
 */
async function getUserById(req, res, next) {
  const user = await User.findById(req.params.id);

  if (!user) return next(createError(404, "User id not found"));

  delete user.password;
  return res.status(201).send(user);
}

/**
 * Delete user by id
 */
async function deleteUserById(req, res, next) {
  const user = await User.findByIdAndDelete(req.body._id);

  if (!user) return next(createError(404, "User id not found"));

  delete user.password;
  return res.status(200).send(user);
}

/**
 * Sign In
 */
async function signIn(req, res, next) {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(createError(401, "Invalid User Credentials"));

  delete user.password;
  return res.status(200).send({
    ...user.toObject({ versionKey: false }),
    accessToken: generateAccessToken({
      name: user.name,
      email: user.email,
    }),
  });
}

/**
 * Sign Up
 */
async function signUp(req, res, next) {
  const user = await User.findOne({ email: req.body.email });
  if (user) return next(createError(409, "User already exists"));

  const createdUser = await new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }).save();

  delete createdUser.password;
  return res.status(201).send({
    ...createdUser.toObject({ versionKey: false }),
    accessToken: generateAccessToken({
      name: createdUser.name,
      email: createdUser.email,
    }),
  });
}

module.exports = { getAllUsers, getUserById, signIn, signUp, deleteUserById };
