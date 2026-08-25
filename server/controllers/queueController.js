const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Queue = require("../models/Queue");

const addToQueue = async (req, res) => {
  try {
    const { appointment, queueNumber } = req.body;

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

    const appointmentData = await Appointment.findById(appointment);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointmentData.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add this appointment to queue",
      });
    }

    if (appointmentData.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Only scheduled appointments can be added to queue",
      });
    }

    const existingQueue = await Queue.findOne({
      appointment,
    });

    if (existingQueue) {
      return res.status(400).json({
        success: false,
        message: "Appointment is already in queue",
      });
    }

    const doctor = await Doctor.findById(appointmentData.doctor);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const queue = await Queue.create({
      appointment: appointmentData._id,
      patient: patient._id,
      doctor: doctor._id,
      queueDate: appointmentData.appointmentDate,
      queueNumber,
      status: "waiting",
    });

    const populatedQueue = await Queue.findById(queue._id)
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
      message: "Patient added to queue successfully",
      queue: populatedQueue,
    });
  } catch (error) {
    console.error("Add to queue error", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getDoctorQueue = async (req, res) => {
  try {
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

    const queues = await Queue.find({
      doctor: doctor._id,
      status: {
        $in: ["waiting", "in-consultation"],
      },
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "appointment",
        select: "appointmentDate appointmentTime reason status",
      })
      .sort({
        queueNumber: 1,
      });

    res.status(200).json({
      success: true,
      count: queues.length,
      queues,
    });
  } catch (error) {
    console.error("Get doctor error", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const startConsultation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const queueId = req.params.id;

    const doctor = await Doctor.findOne({
      user: userId,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "queue entry not found",
      });
    }

    if (queue.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to manage this queue",
      });
    }

    if (queue.status !== "waiting") {
      return res.status(400).json({
        success: false,
        message: "Only waiting patients can start consultation",
      });
    }

    queue.status = "in-consultation";

    await queue.save();

    const updatedQueue = await Queue.findById(queue._id)
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

    res.status(200).json({
      success: true,
      message: "Consultation started successfully",
      queue: updatedQueue,
    });
  } catch (error) {
    console.error("Start consultation error", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const completeQueue = async (req, res) => {
  try {
    const userId = req.user.userId;
    const queueId = req.params.id;

    const doctor = await Doctor.findOne({
      user: userId,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue entry not found",
      });
    }

    if (queue.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to manage this queue",
      });
    }

    if (queue.status !== "in-consultation") {
      return res.status(400).json({
        success: false,
        message: "Only active consultation can be completed",
      });
    }

    queue.status = "completed";
    await queue.save();

    const updatedQueue = await Queue.findById(queue._id)
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

    res.status(200).json({
      success: true,
      message: "Queue completed successfully",
      queue: updatedQueue,
    });
  } catch (error) {
    console.error("Completed queue error", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const cancelQueue = async (req, res) => {
  try {
    const userId = req.user.userId;
    const queueId = req.params.id;

    const doctor = await Doctor.findOne({
      user: userId,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue entry not found",
      });
    }

    if (queue.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to manage this queue",
      });
    }

    if (queue.status !== "waiting") {
      return res.status(400).json({
        success: false,
        message: "Only waiting queue entries can be cancelled",
      });
    }

    queue.status = "cancelled";
    await queue.save();

    const updatedQueue = await Queue.findById(queue._id)
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

    res.status(200).json({
      success: true,
      message: "Queue cancelled successfully",
      queue: updatedQueue,
    });
  } catch (error) {
    console.error("Cancel queue error ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMyQueue = async (req, res) => {
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

    const queues = await Queue.find({
      patient: patient._id,
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "appointment",
        select: "appointmentDate appointmentTime reason status",
      })
      .sort({
        queueDate: 1,
        queueNumber: 1,
      });

    res.status(200).json({
      success: true,
      count: queues.length,
      queues,
    });
  } catch (error) {
    console.error("Get my queue error", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addToQueue,
  getDoctorQueue,
  startConsultation,
  completeQueue,
  cancelQueue,
  getMyQueue
};
