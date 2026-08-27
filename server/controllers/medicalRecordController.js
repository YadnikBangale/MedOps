const MedicalRecord = require("../models/MedicalRecord");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const createMedicalRecord = async (req, res) => {
  try {
    const { appointment, symptoms, diagnosis, prescription, notes } = req.body;

    const userId = req.user.userId;

    const doctor = await Doctor.findOne({
      user: userId,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const appointmentData = await Appointment.findById(appointment);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointmentData.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create record for this appointment",
      });
    }

    if (appointmentData.status !== "completed") {
      return res.status(400).json({
        success: false,
        message:
          "Medical record can only be created for a completed appointment",
      });
    }

    const existingRecord = await MedicalRecord.findOne({
      appointment,
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: "Medical record already exists for this appointment",
      });
    }

    const medicalRecord = await MedicalRecord.create({
      patient: appointmentData.patient,
      doctor: doctor._id,
      appointment,
      symptoms,
      diagnosis,
      prescription,
      notes,
    });

    const populatedRecord = await MedicalRecord.findById(medicalRecord._id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate("appointment");

    res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      medicalRecord: populatedRecord,
    });
  } catch (error) {
    console.error("Create medical record error : ", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMyMedicalRecord = async (req, res) => {
  try {
    const userId = req.user.userId;
    const patient = await Patient.findOne({
      user: userId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const records = await MedicalRecord.find({
      patient: patient._id,
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate("appointment")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: records.length,
      medicalRecords: records,
    });
  } catch (error) {
    console.error("Get medical record error", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getPatientMedicalRecords = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const records = await MedicalRecord.find({
      patient: patientId,
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate("appointment")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: records.length,
      medicalRecords: records,
    });
  } catch (error) {
    console.error("Get patient medical records : ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createMedicalRecord,
  getMyMedicalRecord,
  getPatientMedicalRecords,
};
