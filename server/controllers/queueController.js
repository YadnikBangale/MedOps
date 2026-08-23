const queue = require("../models/Queue");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const addToQueue = async (req, res) => {

    try {

        const   {
            appointment,
            queueNumber
        } = req.body;

        const userId = req.user.userId;

        const patient = await Patient.findOne({
            user: userId
        });

        if(!patient) {

            return res.status(404).json({
                success : false,
                message : "Patient profile not found"
            });
        }

        const appointmentData = await Appointment.findById(appointment);

        if(!appointmentData) {

            return res.status(404).json({
                success : false,
                message : "Appointment not found"
            });
        }

        if( appointmentData.patient.toString() !== patient._id.toString()) {

            return res.status(403).json({
                success : false,
                message : "You are not allowed to add this appointment to queue"
            });
        }

        if(appointmentData.status !== "scheduled") {
            return res.status(400).json({
                success : false,
                message : "Only scheduled appointments can be added to queue"
            });
        }

        const existingQueue = await Queue.findOne({
            appointment
        });

        if(existingQueue) {

            return res.status(400).json({
                success : false,
                message : "Appointment is already in queue"
            });
        }

        if(!doctor) {
            return res.status(404).json({
                success : false,
                message : "Doctor not found"
            });
        }

        const queue = await Queue.create({

            appointment: appointmentData._id,
            patient: patient._id,
            doctor: doctor._id,
            queueDate: appointmentData.appointmentDate,
            queueNumber,
            status: "waiting"
        });

        const populatedQueue = await Queue.findById(queue._id)
        .populate({
            path : "patient",
            populate : {
                path : "user",
                select : "name email"
            }
        })
        .populate({
            path : "doctor",
            populate : {
                path : "user",
                select : "name email"
            }
        })
        .populate("appointment");

    
        res.status(201).json({
            success: true,
            message: "Patient added to queue successfully",
            queue: populatedQueue
        });

    }
    catch(error) {

        console.error("Add to queue error", error);
        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

module.exports = {
    addToQueue
};