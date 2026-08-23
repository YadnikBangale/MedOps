const mongoose = require("mongoose");
const medicalRecordSchema = new mongoose.Schema({

    patient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Patient",
        required : true
    },

    doctor : {

        type : mongoose.Schema.Types.ObjectId,
        ref : "Doctor",
        required : true
    },

    appointment : {

        type : mongoose.Schema.Types.ObjectId,
        ref : "Appointment",
        required : true,
        unique : true
    },

    symptoms : {

        type : String,
        trim : true
    },

    diagnosis : {

        type : String,
        trim : true
    },

    prescription : {

        type : String,
        trim : true
    },

    notes : {
        type : String,
        trim : true
    }
},

{
    timestamps : true
}

);

const MedicalRecord = mongoose.model(
    "MedicalRecord",
    medicalRecordSchema
);

module.exports = MedicalRecord;