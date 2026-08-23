const express = require('express');

const {protect} = require("../middleware/authMiddleware");
const {authorize} = require("../middleware/roleMiddleware");
const {createDepartments, getDepartments, 
    getDepartmentById, updateDepartment,
    toggleDepartmentStatus} = require("../controllers/departmentController");

const {

    createDepartment
} = require("../controllers/departmentController");

const router = express.Router();

router.post("/", protect, authorize('admin'), createDepartment);
router.get("/", protect, getDepartments);
router.get("/:id", protect, getDepartmentById);
router.put("/:id", protect, authorize("admin"), updateDepartment);
router.patch("/:id/status", protect, authorize("admin"), toggleDepartmentStatus);

module.exports = router;