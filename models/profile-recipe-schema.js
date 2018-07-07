var mongoose = require('mongoose');

var profileRecipeSchema = new mongoose.Schema({
    "meat": Number,
    "milk": Number,
    "vegetarian": Number,
    "dessert": Number,
    "vegan": Number,
    "chicken": Number
});

module.exports = profileRecipeSchema;
