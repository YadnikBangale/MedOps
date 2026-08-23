const express = require("express");
const {authorize} = require("../middleware/roleMiddleware");
const {protect} = require("../middleware/authMiddleware");

const {
    createPatient, getMyProfile, updateMyProfile, getPatients
} = require("../controllers/patientController");

const router = express.Router();

router.post("/", protect, createPatient);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/", protect, authorize("admin"), getPatients);

module.exports = router;