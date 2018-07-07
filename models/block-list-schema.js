var mongoose = require('mongoose');

var blockListSchema = new mongoose.Schema({
    "lactose": Number,
    "gluten": Number,
    "peanuts": Number
});

module.exports = blockListSchema;
