const express = require('express');

const {protect} = require("../middleware/authMiddleware");
const {authorize} = require("../middleware/roleMiddleware");
const {
    createAppointment,
    getMyAppointments,
    cancelAppointments,
    getDoctorAppointments,
    completeAppointment
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/", protect, createAppointment);
router.get("/my", protect, getMyAppointments);
router.delete("/:id", protect, cancelAppointments)
router.get("/doctor", protect, authorize("doctor"), getDoctorAppointments);
router.patch("/:id/complete", protect, authorize("doctor"), completeAppointment);

module.exports = router;