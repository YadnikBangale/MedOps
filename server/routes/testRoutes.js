const express = require("express");
const {protect} = require("../middleware/authMiddleware");
const {authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/patient-only", protect, authorize("patient"), (req, res) => {

    res.json({
        success : true,
        message : "Patient only route",
        user : req.user
    });
});

router.get("/admin-only", protect, authorize("admin"), (req, res) => {

    res.json({

        success : true,
        message : "Admin only route",
        user : req.user
    })
})



module.exports = router;    