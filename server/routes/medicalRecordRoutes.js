const express = require("express");
const {protect} = require("../middleware/authMiddleware");
const {authorize} = require("../middleware/roleMiddleware");

const { createMedicalRecord, getMyMedicalRecord, getPatientMedicalRecords } = require("../controllers/medicalRecordController");

const router = express.Router();

router.post("/", protect, authorize("doctor"), createMedicalRecord);
router.get("/my", protect, authorize("patient"), getMyMedicalRecord);
router.get("/patient/:patientId", protect, authorize("doctor"), getPatientMedicalRecords);

module.exports = router;