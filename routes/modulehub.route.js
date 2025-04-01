const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const {createmodulehub } = require("../controllers/modulehub.controller");
const router = express.Router();


router.post("/createmodulehub", authenticateToken(['admin','manager']), createmodulehub)


module.exports = router; 