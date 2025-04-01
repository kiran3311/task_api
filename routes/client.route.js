const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { createclient, getallclients, getclientbyproductid,getclientbyclientid, getclientandproductmappingbyclientid } = require("../controllers/client.controller");
const router = express.Router();

router.post("/creatclient", authenticateToken(['admin','manager']), createclient)
router.get("/getallclient", authenticateToken(['admin','manager','support']), getallclients)
router.get("/getclientbyproductid/:productid", authenticateToken(['admin','manager','support']), getclientbyproductid)
router.get("/getclientbyclientid/:clientid", authenticateToken(['admin','manager','support']), getclientbyclientid)
router.get("/getclientandproductmappingbyclientid/:clientid", authenticateToken(['admin','manager','support']), getclientandproductmappingbyclientid)

module.exports = router;