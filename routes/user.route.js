const express = require("express");
const { createuser, getallusers, loginuser, changepassword, getuserbyid, edituserbyid } = require("../controllers/user.controller");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createuser", authenticateToken(['admin', 'manager']), createuser)
router.post("/loginuser", loginuser)
router.get("/getallusers", authenticateToken(['admin', 'manager', 'support']), getallusers)
router.put("/changepassword", authenticateToken(['admin', 'manager', 'support', "user", "reports"]), changepassword)
router.get("/getuserbyid/:userid", authenticateToken(['admin', 'manager', 'support']), getuserbyid)
router.put("/edituser/:userid", authenticateToken(['admin', 'manager']), edituserbyid)
module.exports = router;