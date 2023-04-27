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
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    noOfRatings:{
        type:Number,
        default:0
    },
    coverImage:mongoose.Schema({
        url:{
            type:String,
            default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAU9U66Yy6S0h3cyyeG0XSfDBC6miYeUOt4hcND44ROw&s",
            required:true
        },
        public_id:{
            type:String,
            required:true
        }
    }),
    avgCost:{
        type:Number,
        required:true
    },
    currentStatus:{
        type:String,
        default:'Open',
        enum:['Open','Close']
    }
})

const Restaurant = mongoose.model("restaurantSchema", restaurantSchema, "Restaurant")
// const Admin = mongoose.model("restaurantSchema", restaurantSchema, "Restaurant")

module.exports = Restaurant