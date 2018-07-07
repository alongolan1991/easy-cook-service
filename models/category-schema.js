var mongoose = require('mongoose'),
    singleCategory = require('./single-category-schema');

var category = new mongoose.Schema({
    "meat": singleCategory,
    "milk": singleCategory,
    "vegetarian": singleCategory,
    "dessert": singleCategory,
    "vegan": singleCategory,
    "chicken": singleCategory
}, {collection: 'categories'});

var newCategory = mongoose.model('newCategory', category);
module.exports = newCategory;
