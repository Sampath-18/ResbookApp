const mongoose = require('mongoose')

const quantitySchema = mongoose.Schema({
    quantity: {
        type: String,
        required: true,
        // unique: true
    },
    cost: {
        type: String,
        required: true
    },
    avgPersons: {
        type: Number,
        required: true
    }
})

const menuItemSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    quantities: [quantitySchema],
    menuCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuCategory"
    }
})

const menuCategorySchema = mongoose.Schema({
    categoryName:{
        type:String,
        required: true,
        // unique: true
    },
    Items:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuItem"
        }
    ],
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }
})

const MenuCategory = mongoose.model('MenuCategory',menuCategorySchema,'MenuCategory');
const MenuItem = mongoose.model("MenuItem", menuItemSchema, "MenuItem");

module.exports = {MenuCategory, MenuItem}