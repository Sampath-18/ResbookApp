const mongoose = require('mongoose')
// const sectionSchema = require('./sectionSchema')

const dineinBookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Section',
        required:true
    },
    bookingTime: {
        type:Date,
        default:Date.now(),
        required:true
    },
    reservationTime: {
        type:Date,
        required:true,
    },
    // noOfChairs: {
    //     type:Number,
    //     required:true
    // },
    guests: [mongoose.Schema({
        guestName:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        }
    })],
    status:{
        type:String,
        required:true,
        enum:['Booked-Open','Booked-Closed','Cancelled'],
        default:"Booked-Open"
    }
})

const DineinBookings = mongoose.model("dineinBookingSchema", dineinBookingSchema, "DineinBookings")

module.exports = DineinBookings