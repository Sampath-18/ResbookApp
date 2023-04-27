const mongoose = require('mongoose')

const userLikingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    favMenuItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'MenuItem',
        required:true
    }],
    favCuisines: [{
        type: String
    }],
    favRestaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Restaurant',
        required:true
    }],
    savedRestaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Restaurant',
        required:true
    }],
    favSections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Section',
        required:true
    }],
    savedSections:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Section',
        required:true
    }]
})

module.exports = mongoose.model("userLikingSchema",userLikingSchema,"UserLikings")