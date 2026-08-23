const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },

    department : {

        type : mongoose.Schema.Types.ObjectId,
        ref : "Department",
        required : true
    },

    specialization : {

        type : String,
        required : true,
        trim : true
    },

    licenseNumber : {

        type : String,
        required : true,
        unique : true,
        trim : true
    },

    experience : {

        type : Number,
        required : true,
        min : 0
    },

    consultationFee : {

        type : Number,
        required : true,
        min : 0
    },

    isAvailable : {
        type : Boolean,
        default : true
    }

    },

    {
        timestamps : true
    }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports= Doctor;