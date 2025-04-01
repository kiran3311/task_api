const express = require("express");
const { baseToBankController,bankToBaseController } = require("../controllers/base.controller");

const router = express.Router();

router.get("/", baseToBankController)
router.post("/",bankToBaseController)

module.exports = router;