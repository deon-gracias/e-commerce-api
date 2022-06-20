const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "YOUR ACCESS TOKEN SECRET";

// Create jwt access token
function generateToken(data) {
  const accessToken = jwt.sign(data, accessTokenSecret);

  return accessToken;
}

// Verify jwt access token
function verifyToken(token) {
  return jwt.verify(token, accessTokenSecret);
}

// Authentication Middleware
async function isAuth(req, res, next) {
  if (!req.headers || !req.headers["authorization"])
    return next(createHttpError(401, "No authorization token provided"));

  const authHeader = req.headers["authorization"];
  const token = authHeader.slice(7);

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) return next(createHttpError(403, "Invalid token"));
    req.user = user;
    next();
  });
}

module.exports = { generateToken, verifyToken, isAuth };
