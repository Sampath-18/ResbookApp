const mongoose = require('mongoose');

const sectionSchema = require('./sectionSchema')
const LocationSchema = require('./LocationSchema')

const adminSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    phone1: {
        type:Number,
        required: true
    },
    phone2: {
        type:Number,
        required: true
    },
    password: {
        type:String,
        required: true
    }
})

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: LocationSchema,
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Section'
    }],
    dateAdded: {
        type: Date,
        default: Date.now()
    },
    admin: adminSchema,
    parkingAvailable: {
        type:String,
        enum:['Yes','No']
    }
})

const Restaurant = mongoose.model("restaurantSchema", restaurantSchema, "Restaurant")
// const Admin = mongoose.model("restaurantSchema", restaurantSchema, "Restaurant")

module.exports = Restaurant