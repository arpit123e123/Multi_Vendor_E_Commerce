const express = require("express");

const router = express.Router();

const {
    addAddress,
    getAddresses
} = require("../controllers/addressController");

const {
    protect
} = require("../middleware/authMiddleware");

router.post("/",protect,addAddress);

router.get("/",protect,getAddresses);

module.exports = router;