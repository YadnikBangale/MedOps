const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

    patient : {
        type : mongoose.Types.ObjectId,
        ref : "Patient",
        required : true
    },

    doctor : {

        type : mongoose.Types.ObjectId,
        ref : "Doctor",
        required : true
    },

    appointmentDate : {
        type : Date,
        required : true
    },

    appointmentTime : {
        type : String,
        required : true
    },
    reason : {
        type : String,
        trim : true
    },

    status : {
        type : String,
        enum : ['scheduled', 'completed', 'cancelled'],
        default : 'scheduled'
    }
},

{
    timestamps : true
}

);

const Appointment = mongoose.model(

    "Appointment",
    appointmentSchema
);

module.exports = Appointment;