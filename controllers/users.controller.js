const createError = require("http-errors");
const { generateAccessToken, generateRefreshToken } = require("../lib/auth");
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
 * Delete user by email
 */
async function deleteUser(req, res, next) {
  const user = await User.findOneAndDelete({ email: req.user.email });

  if (!user) return next(createError(404, "User not found"));

  delete user.password;
  return res.status(200).send(user);
}

/**
 * Sign In
 */
async function signIn(req, res, next) {
  const user = await User.findOne({ email: req.body.email });

  // Check if user is found and password is passed in request
  if (!user || !req.body.password)
    return next(createError(400, "User Credentials not provided"));

  // Compare passwords
  if (!(await user.comparePassword(req.body.password)))
    return next(createError(401, "Invalid user credentials"));

  delete user.password;

  const tokenData = {
    name: user.name,
    email: user.email,
  };

  return res.status(200).send({
    ...user.toObject({ versionKey: false }),
    accessToken: generateAccessToken(tokenData),
    refreshToken: generateRefreshToken(tokenData),
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

  const tokenData = {
    name: createdUser.name,
    email: createdUser.email,
  };

  return res.status(201).send({
    ...createdUser.toObject({ versionKey: false }),
    accessToken: generateAccessToken(tokenData),
    refreshToken: generateRefreshToken(tokenData),
  });
}

/**
 * Regenerate Access Token
 */
async function getNewAccessToken(req, res, next) {
  const refreshToken = req.body.refreshToken;

  if (refreshToken) return next(createError(400, "Refresh Token not provided"));
}

module.exports = {
  getAllUsers,
  getUserById,
  signIn,
  signUp,
  deleteUser,
  getNewAccessToken,
};
