const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { getalltaskdescription, createtaskdescription, getalltaskdescriptionbytasktype, gettasktypebyrole, gettaskdescriptionbyid, edittaskdescriptionbyid } = require("../controllers/taskdescription.controller");
const router = express.Router();

router.post("/createtaskdescription", authenticateToken(['admin', 'manager']), createtaskdescription)
router.get("/getalltaskdescription", authenticateToken(['admin', 'manager', 'support']), getalltaskdescription)
router.get("/getalltaskdescriptionbytasktype/:tasktype", authenticateToken(['admin', 'manager', 'support']), getalltaskdescriptionbytasktype)
router.get("/gettasktypebyrole", authenticateToken(['admin', 'manager', 'support']), gettasktypebyrole)
router.get("/gettaskdescriptionbyid/:tdid", authenticateToken(['admin','manager','support']), gettaskdescriptionbyid)
router.put("/edittaskdescriptionbyid/:tdid",authenticateToken(['admin','manager']),edittaskdescriptionbyid)

module.exports = router;