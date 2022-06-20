const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "YOUR ACCESS TOKEN SECRET";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "YOUR REFRESH TOKEN SECRET";

// Create jwt access token
function generateAccessToken(data) {
  const accessToken = jwt.sign(data, accessTokenSecret, { expiresIn: "15s" });

  return accessToken;
}

// Verify jwt access token
function verifyAccessToken(token) {
  return jwt.verify(token, accessTokenSecret);
}

// Authentication Middleware
async function isAuth(req, res, next) {
  if (!req.headers || !req.headers["authorization"])
    return next(createHttpError(401, "No authorization token provided"));

  const authHeader = req.headers["authorization"];
  const token = authHeader.slice(7);

  // Verify Access Token
  if (!user || !req.body.password)
    return next(createError(400, "User Credentials not provided"));

  if ((await user.comparePassword(req.body.password)))
    return next(createError(401, "Invalid User Credentials"));
}

module.exports = { generateAccessToken, verifyAccessToken, isAuth };
