const express = require('express');
const {protect} = require("../middleware/authMiddleware");
const {authorize} = require("../middleware/roleMiddleware");

const { createDoctor, getDoctors, getDoctorById, updateDoctorAvailability
    , updateDoctor
 } = require("../controllers/doctorController");

const router = express.Router();

router.post("/", protect, authorize("admin"), createDoctor);
router.get("/", protect, getDoctors);
router.get("/:id", protect, getDoctorById);
router.patch("/:id/availability", protect, updateDoctorAvailability);
router.put("/:id", protect, authorize("admin"), updateDoctor);

module.exports = router;