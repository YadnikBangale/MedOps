const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const queueRoutes = require("./routes/queueRoutes");

const connectDB = require('./config/db');
const MedicalRecord = require('./models/MedicalRecord');
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/queue", queueRoutes);

connectDB();

app.get("/api/health", function(req, res) {

    res.json({
        success : true,
        message : "MedOps running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{

    console.log(`server running on port ${PORT}`);
});
