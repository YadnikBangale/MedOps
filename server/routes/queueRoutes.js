const express = require("express");
const {protect} = require("../middleware/authMiddleware");
const {
    addToQueue,
    getDoctorQueue,
    startConsultation,
    completeQueue,
    cancelQueue
} = require("../controllers/queueController");

const router = express.Router();

router.post("/",protect, addToQueue);
router.get("/doctor", protect, getDoctorQueue);
router.patch("/:id/start", protect, startConsultation);
router.patch("/:id/complete", protect, completeQueue);
router.patch("/:id/cancel", protect, cancelQueue);

module.exports = router;