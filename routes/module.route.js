const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { createmodule, getallmodules, getmodulebyprojectid, getmodulebyid, updatemodule , deletemodulekbyid } = require("../controllers/module.controller");
const router = express.Router();

router.post("/createmodule", authenticateToken(['admin','manager']), createmodule)
router.get("/getallmodules", authenticateToken(['admin','manager','user']), getallmodules)
router.get("/getmodulebyprojectid/:projectid", authenticateToken(['admin','manager','user']), getmodulebyprojectid)
router.get("/getmodulebyid/:moduleid", authenticateToken(['admin','manager']), getmodulebyid)
router.put("/updatemodule/:moduleid", authenticateToken(['admin','manager']), updatemodule)
router.delete("/deletemodulekbyid/:moduleid", authenticateToken(['admin', "manager"]), deletemodulekbyid)
module.exports = router;