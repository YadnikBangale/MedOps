const Patient = require("../models/Patient");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const createPatient = async (req, res) => {
  try {
    const { dateOfBirth, gender, bloodGroup, phone, address } = req.body;

    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can create patient profile",
      });
    }

    const existingPatient = await Patient.findOne({
      user: userId,
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "patient already exists",
      });
    }

    const patient = await Patient.create({
      user: userId,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Patient profile created successfully",

      patient: {
        id: patient._id,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },

        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        phone: patient.phone,
        address: patient.address,
      },
    });
  } catch (error) {
    console.error("Create patient error", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const createPatientByAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "patient",
    });

    // Create patient profile
    const patient = await Patient.create({
      user: user._id,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",

      patient: {
        id: patient._id,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },

        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        phone: patient.phone,
        address: patient.address,
      },
    });
  } catch (error) {
    console.error("Create patient by admin error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const patient = await Patient.findOne({
      user: userId,
    }).populate("user", "name email role");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Get patient profile error: ", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { dateOfBirth, gender, bloodGroup, phone, address } = req.body;

    const patient = await Patient.findOne({
      user: userId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    if (dateOfBirth !== undefined) {
      patient.dateOfBirth = dateOfBirth;
    }

    if (gender !== undefined) {
      patient.gender = gender;
    }

    if (bloodGroup !== undefined) {
      patient.bloodGroup = bloodGroup;
    }

    if (phone !== undefined) {
      patient.phone = phone;
    }

    if (address !== undefined) {
      patient.address = address;
    }

    await patient.save();

    const updatedPatient = await Patient.findById(patient._id).populate(
      "user",
      "name email role",
    );

    res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Update patient profile error", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get patient error", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPatient,
  createPatientByAdmin,
  getMyProfile,
  updateMyProfile,
  getPatients,
};
