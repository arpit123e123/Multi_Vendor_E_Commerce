const express = require("express");

const {
  chatWithAI,
} = require("../src/controllers/aiController");

const router = express.Router();

router.post("/chat", chatWithAI);

module.exports = router;