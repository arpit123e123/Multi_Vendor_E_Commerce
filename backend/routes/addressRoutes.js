const express = require("express");

const router = express.Router();

const {
    addAddress,
    getAddresses
} = require("../src/controllers/addressController");

const {
    protect
} = require("../src/middleware/authMiddleware");

router.post("/",protect,addAddress);

router.get("/",protect,getAddresses);

module.exports = router;