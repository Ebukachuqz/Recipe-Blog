const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
    mealName: {
        type: String,
        required: [true, "Please provide a name for ur meals"],
    },

    instructions: {
        type: String,
        required: [true, 'Please provide Instructions']
    },

    ingredients: {
        type: Array,
        required: [true, "Please provide the ingredient(s)"],
    },

    category: {
        type: String,
        required: [true, "Please provide the category"],
    },

    videoLink: {
        type: String,
        required: false,
    },

    image: {
        type: String,
        required: [true, "Please provide a picture for your Meal"],
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user"]
    }
},
    { timestamps: true });

MealSchema.index({mealName: 'text', category: 'text'})


module.exports = mongoose.model('Meal', MealSchema)
