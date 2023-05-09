const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone1: {
    type: String,
    required: false,
    // validate: {
    //   validator: function(v) {
    //     return /^\d{10}$/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid phone number!`
    // }
  },
  phone2: {
    type: String,
    required: false,
    // validate: {
    //   validator: function(v) {
    //     return /^\d{10}$/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid phone number!`
    // }
  },
  age: {
    type:Number,
    required:false,
    min: 10,
    max:110
  },
  gender: {
    type:String,
    required:false,
    default:"Prefer not to say",
    enum: ["Male","Female","Prefer not to say"]
  },
  maritalStatus: {
    type:String,
    required:false,
    default:"Prefer not to say",
    enum: ["Male","Female","Prefer not to say"]
  },
  bookings:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DineinBookings"
    }
  ]
});
const User = new mongoose.model("Users", UserSchema, "Users");
module.exports = User;