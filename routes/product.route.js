const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { createproduct, getallproducts,getproductbyid,editproductbyid, getallproductsfortask } = require("../controllers/product.controller");
const router = express.Router();

router.post("/createproduct", authenticateToken(['admin','manager']), createproduct)
router.get("/getallproducts", authenticateToken(['admin','manager','support']), getallproducts)
router.get("/getproductbyid/:productid", authenticateToken(['admin','manager','support']), getproductbyid)
router.put("/editproduct/:productid",authenticateToken(['admin','manager']),editproductbyid)
router.get("/getallproductsfortask",authenticateToken(['admin','manager','support']),getallproductsfortask)
//router.get("/getallproductsfortask",authenticateToken(['admin','manager','support']),getallproducts)
module.exports = router;