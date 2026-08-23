const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const createAppointment = async (req, res) => {

    try {

        const {
            doctor,
            appointmentDate,
            appointmentTime,
            reason
        } = req.body;

        const userId = req.user.userId;

        const patient = await Patient.findOne({
            user : userId
        });

        if(!patient) {

            return res.status(404).json({
                success : false,
                message : "Patient profile not found"
            });
        }

        const doctorProfile = await Doctor.findById(doctor);

        if(!doctorProfile) {

            return res.status(404).json({
                success : false,
                message : "Doctor not found"
            });
        }

        if(!doctorProfile.isAvailable) {

            return res.status(400).json({
                success : false,
                message : "Doctor is currently unavailable"
            });
        }

        const existingAppointment = await Appointment.findOne({
            doctor,
            appointmentDate,
            appointmentTime,
            status : "scheduled"
        });

        if(existingAppointment) {

            return res.status(400).json({
                success : false,
                message : "Doctor is already booked for this time"
            });
        }

        const appointment = await Appointment.create({

            patient: patient._id,
            doctor,
            appointmentDate,
            appointmentTime,
            reason

        });

        const populatedAppointment = await Appointment.findById(appointment._id).populate("patient")
        .populate({

            path : "doctor",
            populate : [
                {
                    path : "user",
                    select : "name email"
                },
                {
                    path : "department",
                    select : "name location"
                }
            ]
        });

        res.status(201).json({

            success : true,
            message : "Appointment booked successfully",
            appointment : populatedAppointment
        });

    }
    catch(error) {

        console.error("Create appointment error : ", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });

    }

    
};

const getMyAppointments = async (req, res) => {

        try {

            const userId = req.user.userId;
            const patient = await Patient.findOne({
                user : userId
            });

            if(!patient) {
                return res.status(404).json({
                    success : false,
                    message : "Patient profile not found"
                });
            }

            const appointments = await Appointment.find({
                patient : patient._id
            })
            .populate({
                path : "doctor",
                populate : [
                    {
                        path : "user",
                        select : "name email"
                    },

                    {
                        path : "department",
                        select : "name location"
                    }
                ]
            })
            .sort({
                appointmentDate : 1,
                appointmentTime : 1
            });

            res.status(200).json({
                success : true,
                count : appointments.length,
                appointments
            });

        }

        catch(error) {

            console.error("Get appointments error : ", error);

            res.status(500).json({
                success : false,
                message : "Server error"
            });

        }
};

const cancelAppointments = async (req, res) => {

    try{

        const userId = req.user.userId;
        const appointmentId = req.params.id;

        const patient = await Patient.findOne({
            user : userId
        });

        if(!patient) {
            return res.status(404).json({
                success : false,
                message : "Patient profile not found "
            });
        }

        const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {

            return res.status(404).json({
                success : false,
                message : "Appointment not found"
            });
        }

        if(appointment.patient.toString() !== patient._id.toString()) {
            return res.status(403).json({
                success : false,
                message : "Cancellation not allowed"
            });
        }

        if(appointment.status === "cancelled") {
            return res.status(400).json({
                success : false,
                message : "Appointment already cancelled"
            });
        }

        appointment.status = "cancelled";

        await appointment.save();

        res.status(200).json({
            success : true,
            message : "Appointment cancelled successfully",
            appointment
        });

    }
    catch(error) {

        console.error("Cncel appointment error", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

const getDoctorAppointments = async (req, res) => {

    try {

        const userId = req.user.userId;

        const doctor = await Doctor.findOne({
            user : userId
        });

        if(!doctor) {

            return res.status(404).json({
                success : false,
                message : "Doctor profile not found"
            });
        }

        const appointments = await Appointment.find({
            doctor : doctor._id
        })
        .populate({
            path : "patient",
            populate : {
                path : "user",
                select : "name email"
            }
        })
        .sort({
            appointmentDate : 1,
            appointmentTime : 1
        });

        res.status(200).json({
            success : true,
            count : appointments.length,
            appointments
        });

    }
    catch(error) {

        console.error("Get doctor appointment error", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });

    }
};

const completeAppointment = async (req, res) => {

    try{

        const userId = req.user.userId;
        const appointmentId = req.params.id;

        const doctor = await Doctor.findOne({
            user : userId
        });

        if(!doctor) {
            return res.status(404).json({
                success : false,
                message : "Doctor profile not found"
            });
        }

        const appointment = await Appointment.findById(appointmentId);
        if(!appointment) {

            return res.status(404).json({
                success : false,
                message : "Appointment not found"
            });
        }

        if(appointment.doctor.toString() !== doctor._id.toString()) {

            return res.status(403).json({
                success : false,
                message : "You are not allowed to complete this appointment"
            });
        }

        if(appointment.status === "cancelled") {

            return res.status(400).json({
                success : false,
                message : "Cancelled appointment cannot be completed"
            });
        }

        if(appointment.status === "completed") {

            return res.status(400).json({
                success : false,
                message : "Appointment already completed"
            });
        }

        appointment.status = "completed";

        await appointment.save();

        res.status(200).json({
            success : true,
            message : "Appointment completed successfully",
            appointment
        });
        
    }
    catch(error) {

        console.error("Complete appointment error : ", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

module.exports = {
    createAppointment,
    getMyAppointments,
    cancelAppointments,
    getDoctorAppointments,
    completeAppointment  
};