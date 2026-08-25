const express = require("express");
const {protect} = require("../middleware/authMiddleware");
const {
    addToQueue,
    getDoctorQueue,
    startConsultation,
    completeQueue,
    cancelQueue,
    getMyQueue
} = require("../controllers/queueController");

const router = express.Router();

router.post("/",protect, addToQueue);
router.get("/doctor", protect, getDoctorQueue);
router.patch("/:id/start", protect, startConsultation);
router.patch("/:id/complete", protect, completeQueue);
router.patch("/:id/cancel", protect, cancelQueue);
router.get("/my", protect, getMyQueue);

module.exports = router;