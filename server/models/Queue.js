const mongoose = require("mongoose");
const queueSchema = new mongoose.Schema(

    {
        appointment : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Appointment",
            required : true,
            unique : true
        },

        patient : {

            type : mongoose.Schema.Types.ObjectId,
            ref : "Patient",
            require : true
        },

        doctor : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Doctor",
            required : true
        },

        queueDate : {

            type : Date,
            required : true,
        },

        status : {
            type : String,
            enum : [
                "waiting",
                "in-consultation",
                "completed",
                "cancelled"
            ],
            default : "waiting"
        },

        queueNumber : {
            type : Number,
            required : true
        }
    },

    {
        timestamps : true
    }
);

const Queue = mongoose.model("Queue", queueSchema);
module.exports = Queue;