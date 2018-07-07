var mongoose = require('mongoose');

var recipe = new mongoose.Schema({
    "category": String,
    "name": String,
    "image": String,
    "preparation_time": Number,
    "calories": Number,
    "ingredients": [String],
    "preparation_method": [String],
    "video_steps": [String],
    "gluten": Number,
    "lactose": Number,
    "peanuts": Number,
    "comments": [String]
}, {collection: 'recipes'});

var newRecipe = mongoose.model('recipe', recipe);
module.exports = newRecipe;
