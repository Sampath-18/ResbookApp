const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

const timingSchema = new mongoose.Schema({
  Monday: new mongoose.Schema({
    "open_time": { type: Date, required: true },
    "close_time": { type: Date, required: true },
  }),
  Tuesday: new mongoose.Schema({
    "open_time": { type: Date, required: true },
    "close_time": { type: Date, required: true },
  }),
  Wednesday: new mongoose.Schema({
    "open_time": { type: Date, required: true },
    "close_time": { type: Date, required: true },
  }),
  Thursday: new mongoose.Schema({
    "open_time": { type: Date, required: true },
    "close_time": { type: Date, required: true },
  }),
  Friday: new mongoose.Schema({
    "open_time": { type: Date, required: true },
    "close_time": { type: Date, required: true },
  }),
  Saturday: new mongoose.Schema({
    "open_time": { type: Date, required: true },
    "close_time": { type: Date, required: true },
  }),
  Sunday: new mongoose.Schema({
    "open_time": { type: Date, required: true },
    "close_time": { type: Date, required: true },
  }),
});

const {MenuCategory, MenuItem} = require("./menuCategorySchema");

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },
  sectionDescription: {
    type: String,
    required: true,
  },
  secImg: [imageSchema],
  avgCost: {
    type: Number,
    required: true,
  },
  reservationCharge: {
    type: Number,
    required: true,
    default: 0
  },
  capacity: {
    type: Number,
    required: true
  },
  dineinAvailable: {
    type: String,
    required: true,
    enum: ["Yes","No"]
  },
  autoAcceptBookings: {
    type: String,
    required: true,
    enum: ["Yes","No"]
  },
  cateringAvailable: {
    type: String,
    required: true,
    enum: ["Yes","No"]
  },
  rating: {
    type: Number,
    required: true,
    enum: [1,2,3,4,5],
    default: 3,
  },
  timing: timingSchema,
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuCategory" }],
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  }
});

module.exports = mongoose.model("sectionSchema", sectionSchema, "Section");
