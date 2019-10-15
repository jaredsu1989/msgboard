var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function getNumber(replycount, replies) {
  return replies.length;
}

var ReplySchema = new Schema({  
  text: String,
  delete_password: String,
  created_on: Date,  
  reported: Boolean  
  
});

var ThreadSchema = new Schema({
  board: String,
  text: String,
  delete_password: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  replies: [ReplySchema],
  replycount: {
    type: Number
  }
  
  
});




module.exports = mongoose.model('schema', ThreadSchema);