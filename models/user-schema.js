var mongoose = require('mongoose'),
    profileRecipeSchema = require('./profile-recipe-schema'),
    blockListSchema = require('./block-list-schema');

var user = new mongoose.Schema({
    "full_name": String,
    "password": String,
    "email": String,
    "favorites": [String],
    "profile_categories": profileRecipeSchema,
    "block_list": blockListSchema,
    "diet": Number,
    "fast": Number
}, {collection: 'users'});

var newUser = mongoose.model('newUser', user);
module.exports = newUser;
