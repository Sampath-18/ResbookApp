const mongoose = require('mongoose')

const userLikingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    favMenuItems: 
    [{
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
    }],
    foodType:{
        type:String,
        default:'Both',
        enum:['Veg','Non-Veg','Both']
    },
    drinking:{
        type:String,
        default:'Non-Drinker',
        enum:['Drinker','Non-Drinker']
    },
    smoking:{
        type:String,
        default:'Non-Smoker',
        enum:['Smoker','Non-Smoker'],
    },
    preference:{
        type:String,
        default:'Quality',
        enum:['Budget','Quality']
    }
})

module.exports = mongoose.model("userLikingSchema",userLikingSchema,"UserLikings")