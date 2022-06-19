const express = require("express");
const { index } = require("../controllers/index.controller");
const router = express.Router();

/* GET home page. */
router.get("/", index);

module.exports = router;
