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

  // Delete password field
  delete user.password;

  // Generate Tokens
  const tokenData = {
      name: user.name,
      email: user.email,
    },
    accessToken = generateAccessToken(tokenData),
    refreshToken = generateRefreshToken(tokenData);

  // Save refresh token in user document
  user.refreshToken = refreshToken;

  return res.status(200).send({
    ...user.toObject({ versionKey: false }),
    accessToken: accessToken,
    refreshToken: refreshToken,
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

  // Delete password field
  delete user.password;

  // Generate Tokens
  const tokenData = {
      name: user.name,
      email: user.email,
    },
    accessToken = generateAccessToken(tokenData),
    refreshToken = generateRefreshToken(tokenData);

  // Save refresh token in user document
  user.refreshToken = refreshToken;

  return res.status(201).send({
    ...user.toObject({ versionKey: false }),
    accessToken: accessToken,
    refreshToken: refreshToken,
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
