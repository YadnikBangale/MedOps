const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const bcrypt = require("bcrypt");

const createDoctor = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            department,
            specialization,
            licenseNumber,
            experience,
            consultationFee
        } = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser) {

            return res.status(400).json({

                success : false,
                message : "user with this email exists"
            });
        }


        const existingDepartment = await Department.findById(department);

        if(!existingDepartment) {

            return res.status(404).json({
                success : false,
                message : "Department not found"
            });
        }

        if(!existingDepartment.isActive) {

            return res.status(400).json({
                success : false,
                message : "Cant assign doctor to an inactive dept"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role : "doctor"
        });

        const doctor = await Doctor.create({
            user : user._id,
            department : existingDepartment._id,
            specialization,
            licenseNumber,
            experience,
            consultationFee
        });


        res.status(201).json({

            success : true,
            message : "Doctor created successfully",

            doctor : {

                id : doctor._id,

                user : {

                    id : user._id,
                    name : user.name,
                    email : user.email
                },

                department : {

                    id : existingDepartment._id,
                    name : existingDepartment.name
                },

                specialization : doctor.specialization,
                licnseNumber : doctor.licenseNumber,
                experience : doctor.experience,
                consultationFee : doctor.consultationFee,
                isAvailable : doctor.isAvailable
            }
        });
    }

    catch(error) {

        console.error("Create doctor error", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

const getDoctors = async (req, res) => {

    try {
        const doctors = await Doctor.find({isAvailable : true})
        .populate("user","name email")
        .populate("department", "name location")
        .sort({ createdAt : -1 });

        res.status(200).json({
            success : true,
            count : doctors.length,
            doctors
        });
    }

    catch(error) {

        console.error("Get doctors error : ", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

const getDoctorById = async (req, res) => {

    try {

        const {id} = req.params;
        const doctor = await Doctor.findById(id)
        .populate("user", "name email")
        .populate("department", "name location");

        if(!doctor) {

            return res.status(404).json({
                success : false,
                message : "Doctor not found"
            });
        }

        res.status(200).json({

            success : true,
            doctor
        });
    }

    catch(error) {

        console.error("Get doctor error: ", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

const updateDoctorAvailability = async (req, res) => {

    try {

        const {id} = req.params;
        const doctor = await Doctor.findById(id);

        if(!doctor) {

            return res.status(404).json({

                success : false,
                message : "Doctor not found"
            });
        }

        if(req.user.role === "admin") {

            doctor.isAvailable= !doctor.isAvailable;
        }

        else if(req.user.role === "doctor") {

            if(doctor.user.toString() !== req.user.userId.toString()) {

                return res.status(403).json({
                    success : false,
                    message : "You can only update your own availability"
                });
            }

            doctor.isAvailable = !doctor.isAvailable;
        }

        else {

            return res.status(403).json({

                success : false,
                message : "Yout are not authorized to update doctor's availability"
            });
        }

        await doctor.save();

        res.status(200).json({
            success : true,
            message : doctor.isAvailable ? "Doctor is now available" : "Doctor is now unavailable", 
            isAvailable: doctor.isAvailable
        });
    }

    catch(error) {

        console.error("update availability error", error);

        res.status(500).json({

            success : false,
            message : "Server error"
        });
    }
}

const updateDoctor = async (req, res) => {

    try {

        const {id} = req.params;

        const {
            department,
            specialization,
            licenseNumber,
            experience,
            consultationFee
        } = req.body;


        const doctor = await Doctor.findById(id);

        if(!doctor) {

            return res.status(404).json({
                success : false,
                message : "Doctor not found"
            });
        }

        if(department !== undefined) {

            const existingDepartment = await Department.findById(department);

            if(!existingDepartment) {

                return res.status(404).json({
                    success : false,
                    message : "Departmentnot found"
                });
            }

            if(!existingDepartment.isActive) {

                return res.status(400).json({
                    success : false,
                    message : "Cannot assign doctor to an inactive department"
                });
            }

            doctor.department = existingDepartment._id;
        }

        if(licenseNumber !== undefined) {

            const existingDoctor = await Doctor.findOne({licenseNumber, _id: {$ne: id}});

            if(existingDoctor) {
                return res.status(400).json({
                    success : false,
                    message : "Doctor with this license number already exists"
                });
            }
            doctor.licenseNumber = licenseNumber;
        }

        if(specialization != undefined) {
            doctor.specialization = specialization;
        }

        if(experience != undefined) {
            doctor.experience = experience;
        }

        if(consultationFee != undefined) {
            doctor.consultationFee = consultationFee;
        }

        await doctor.save();

        const updatedDoctor = await Doctor.findById(id)
        .populate("user", "name email")
        .populate("department", "name location");

        res.status(200).json({

            success : true,
            message : "Doctor updated successfully",
            doctor : updatedDoctor
        });

    }
    catch(error) {

        console.error("Update doctor error : ",error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};



module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctorAvailability,
    updateDoctor
    
};