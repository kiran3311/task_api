const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { createtask, getalltask, dashboard, gettaskbyid, updatetaskpercentage, getprojectsbyproductid, getallusersbyrole, taskcomment,getalltaskbyproduct, createtaskcomment, getcommentbytaskid, updatetask, updatetaskstatusandtime, updatetaskstatus, deletetaskbyid, getallproducts, getallclients, getallprojects, getallprojectleads, taskreports, taskreportwithcomments, getallassignee, tasktimesheetwithcomments, taskdashboarddata , usertimesheetwithcomments, getcommentbycommentid, updatecommentbyid, updateprogresspercentage, taskbyassignee} = require("../controllers/task.controller");
const router = express.Router();

router.post("/createtask", authenticateToken(['admin', 'manager', 'support']), createtask)
router.put("/updatetask", authenticateToken(['admin', 'manager']), updatetask)
router.get("/getalltask", authenticateToken(['admin', "manager", 'user', "support"]), getalltask)
router.get("/dashboard", authenticateToken(['admin', 'manager','reports']), dashboard)
router.get("/gettaskbyid/:taskid", authenticateToken(['admin', "manager", 'user', "support"]), gettaskbyid)
router.get("/getprojectsbyproductid/:productid", authenticateToken(['admin', "manager", 'support']), getprojectsbyproductid)
router.get("/getallusersbyrole/:role", authenticateToken(['admin', 'manager', 'support']), getallusersbyrole)
router.put("/updatetaskpercentage", authenticateToken(['admin', "manager", 'user']), updatetaskpercentage)
router.post("/createtaskcomment", authenticateToken(['admin', 'manager', "support", 'user']), createtaskcomment)
router.post("/getcommentbytaskid/:taskid", authenticateToken(['admin', 'manager', "support", 'user']), getcommentbytaskid)

router.put("/updatetaskstatus", authenticateToken(['admin', 'manager', "support", 'user']), updatetaskstatus)
router.delete("/deletetaskbyid/:taskid", authenticateToken(['admin', "manager"]), deletetaskbyid)

router.get("/getallproducts", authenticateToken(['admin', 'manager', 'support', 'reports']), getallproducts)
router.get("/getallclients", authenticateToken(['admin', 'manager', 'support', 'reports']), getallclients)
router.get("/getallprojects", authenticateToken(['admin', 'manager', 'support', 'reports']), getallprojects)
router.get("/getallprojectleads", authenticateToken(['admin', 'manager', 'support', 'reports']), getallprojectleads)
router.get("/getallassignee", authenticateToken(['admin', 'manager', 'support', 'reports']), getallassignee)
router.get("/taskreports", authenticateToken(['admin', 'manager', "reports","support"]), taskreports)
router.get("/taskreportwithcomments", authenticateToken(['admin', 'manager', "reports","support"]), taskreportwithcomments)
router.get("/tasktimesheetwithcomments", authenticateToken(['admin', 'manager', "reports","support"]), tasktimesheetwithcomments)

router.get("/taskreportsbyproduct", authenticateToken(['admin', 'manager', "reports","support", "user"]), getalltaskbyproduct)
router.get("/taskdashboarddata", authenticateToken(['admin', 'manager', "reports","support"]), taskdashboarddata)
router.get("/usertimesheetwithcomments", authenticateToken(['user']), usertimesheetwithcomments)
router.get("/getcommentbyid/:commentid", authenticateToken(['admin', 'manager', "support", 'user']), getcommentbycommentid)
router.put("/updatecommentbycommentid/:commentid",authenticateToken(['admin', 'manager', "support", 'user']),updatecommentbyid)
router.put("/updateprogresspercentage", authenticateToken(['admin', 'manager', "support", 'user']), updateprogresspercentage)
router.post("/taskbyassignee", authenticateToken(['admin', 'manager', "reports","support", "user"]), taskbyassignee)
module.exports = router;   