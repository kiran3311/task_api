const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { createmanagerusermapping, getmanagerusermapping, getprojectleadbyproductid, getusersbyprojectidandprojectleadid, getteammanagermapping, getusermapping, editmanagerusermapping } = require("../controllers/managerusermapping.controller");
const router = express.Router();

router.post("/createmanagerusermapping", authenticateToken(['admin', 'manager']), createmanagerusermapping)

router.get("/getmanagerusermapping", authenticateToken(['admin', 'manager', 'support']), getmanagerusermapping)
router.get("/getprojectleadbyproductid/:productid", authenticateToken(['admin', 'manager', 'support']), getprojectleadbyproductid)
router.get("/getusersbyprojectidandprojectleadid/:productid/:managerid", authenticateToken(['admin', 'manager', 'support']), getusersbyprojectidandprojectleadid)
router.get("/getusersbyprojectidandprojectleadid/:productid/:managerid", authenticateToken(['admin', 'manager', 'support']), getusersbyprojectidandprojectleadid)
router.get("/getteammanagermapping", authenticateToken(['admin', 'manager', 'support', "user"]), getteammanagermapping)
router.get("/getusermapping/:managerid/:productid", authenticateToken(['admin', 'manager']), getusermapping)
router.put("/editmanagerusermapping/:managerid/:productid", authenticateToken(['admin', 'manager']), editmanagerusermapping)
module.exports = router;