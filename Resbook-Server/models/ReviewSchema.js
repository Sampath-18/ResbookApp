const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Section',
        required:true
    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5],
        required:true
    },
    restaurantRating:{
        type:Number,
        enum:[1,2,3,4,5],
        required:true
    },
    review:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

Review = mongoose.model("reviewSchema",reviewSchema,"Review")
module.exports = Review