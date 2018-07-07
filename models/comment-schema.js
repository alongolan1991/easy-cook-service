var mongoose = require('mongoose');

var comment = new mongoose.Schema({
    "user_name": String,
    "rate": Number,
    "content": String
}, {collection: 'comments'});

var newComment = mongoose.model('newComment', comment);
module.exports = newComment;
