const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { uploadsalary, getemployeeonstatementdate ,getsalaryslip} = require("../controllers/salaryslip.controller");
const router = express.Router();

router.post("/uploadsalary", authenticateToken(['reports']), uploadsalary)
router.get("/getemployeeonstatementdate/:statementDate", authenticateToken(['reports']), getemployeeonstatementdate)
router.get("/getsalaryslip", authenticateToken(['reports']), getsalaryslip)

module.exports = router;