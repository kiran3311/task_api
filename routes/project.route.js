const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { createproject, getallprojects } = require("../controllers/project.controller");
const router = express.Router();

router.post("/createproject", authenticateToken(['admin','manager']), createproject)
router.get("/getallproject", authenticateToken(['admin','manager','support']), getallprojects)

module.exports = router;