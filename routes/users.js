const {
  getAllUsers,
  getUserById,
  signIn,
  signUp,
} = require("../controllers/users.controller");

const router = require("express").Router();

// Get all users
router.get("/", getAllUsers);

// Get user by id
router.get("/:id", getUserById);

// Sign up
router.post("/signup", signUp);

// Sign in
router.post("/signin", signIn);

module.exports = router;
