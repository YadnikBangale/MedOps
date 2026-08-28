const express = require("express");
const { authorize } = require("../middleware/roleMiddleware");
const { protect } = require("../middleware/authMiddleware");

const {
  createPatient,
  createPatientByAdmin,
  getMyProfile,
  updateMyProfile,
  getPatients,
} = require("../controllers/patientController");

const router = express.Router();

router.post("/", protect, createPatient);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/", protect, authorize("admin"), getPatients);
router.post("/admin", protect, authorize("admin"), createPatientByAdmin);

module.exports = router;
