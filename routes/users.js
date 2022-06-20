const {
  getAllUsers,
  getUserById,
  signIn,
  signUp,
  deleteUserById,
} = require("../controllers/users.controller");

const router = require("express").Router();

// Get all users
router.get("/", getAllUsers);

// Get user by id
router.get("/:id", getUserById);

// TODO: Need to add authentication middleware
router.delete("/delete", deleteUserById);

// Sign up
router.post("/signup", signUp);

// Sign in
router.post("/signin", signIn);

module.exports = router;
