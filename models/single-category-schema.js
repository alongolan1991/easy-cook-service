var mongoose = require('mongoose');

var singleCategory = new mongoose.Schema({
    "icon": String,
    "recipes": [String]
});

module.exports = singleCategory;
