const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    Longitude:{
        type: Number,
        required: true
    },
    Latitude:{
        type: Number,
        required: true
    },
    State:{
        type: String,
        required: true
    },
    District:{
        type: String,
        required: true
    },
    Country:{
        type: String,
        required: true
    },
    Road:{
        type: String,
        required: true
    }
});

module.exports = LocationSchema;