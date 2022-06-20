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
 * Get user by email
 */
async function getUserByEmail(req, res, next) {
  const user = await User.findOne({ email: req.user.email }); // req.user is created by isAuth middleware

  if (!user) return next(createError(404, "User not found"));

  delete user.password;
  return res.status(200).send(user);
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
  // Check if password is passed in request
  if (!req.body.password)
    return next(createError(400, "User Credentials not provided"));

  const user = await User.findOne({ email: req.body.email });

  // User not found
  if (!user) return next(createError(404, "User not found"));

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

  // Generate Tokens
  const tokenData = {
      name: createdUser.name,
      email: createdUser.email,
    },
    accessToken = generateAccessToken(tokenData),
    refreshToken = generateRefreshToken(tokenData);

  // Save refresh token in user document
  createdUser.refreshToken = refreshToken;
  await createdUser.save();

  delete createdUser.password; // Delete password field

  return res.status(201).send({
    ...createdUser.toObject({ versionKey: false }),
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
}

/**
 * Regenerate Access Token
 */
async function getNewAccessToken(req, res, next) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken || !req.body.email)
    return next(createError(400, "Insuffiecient credentials provided"));

  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(createError(404, "User Not Found"));

  if (!user.refreshToken !== refreshToken)
    return next(createError(403, "Invalid Refresh Token"));

  return res.status(200).send({ accessToken: generateAccessToken(tokenData) });
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  signIn,
  signUp,
  deleteUser,
  getNewAccessToken,
};
