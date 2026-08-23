const express = require("express");

const {protect} = require("../middleware/authMiddleware");
const {
    addToQueue
} = require("../controllers/queueController");

const router = express.Router();

router.post("/",protect, addToQueue);

module.exports = router;