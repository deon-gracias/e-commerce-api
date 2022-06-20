const {
  getAllUsers,
  getUserById,
  getUserByEmail,
  signIn,
  signUp,
  deleteUser,
  getNewAccessToken,
} = require("../controllers/users.controller");
const { isAuth } = require("../lib/auth");

const router = require("express").Router();

// Get all users
router.get("/", getAllUsers);

// Profile
router.get("/profile", isAuth, getUserByEmail);

// Delete user
router.delete("/delete", isAuth, deleteUser);

// Sign up
router.post("/signup", signUp);

// Sign in
router.post("/signin", signIn);

// Sign in
router.post("/token", getNewAccessToken);

module.exports = router;
