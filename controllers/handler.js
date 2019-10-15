//Connect to data base
var mongo = require('mongodb');
var mongoose = require('mongoose');
let DB_STRING = process.env.DB;
mongoose.connect(DB_STRING, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

//Import  models
var model = require('../models/model.js');


function ThreadHandler() {
  //create handler for saving data
  this.saveThread = function(data) {
    //create new model based on constructor
    var threadDoc = new model({
      board: data.board,
      text: data.text,
      delete_password: data.delete_password,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      replies: [],
      replycount: 0
      
      
    });    
    threadDoc.save(function(err, result) {});    
  }
   
  this.returnThreadArray = function(result) {
   return result.map((currentTopic) => {
       return {                                   
      _id: currentTopic._id,
      board: currentTopic.board,
      text: currentTopic.text,      
      created_on: currentTopic.created_on,
      bumped_on: currentTopic.bumped_on
      
              }
          });
  }
  
  this.returnArray = function (result) {
    //
      //return top 10 bumped thread
    var sortedArray = result.concat().sort(function(a, b) {
      return b.bumped_on - a.bumped_on
    });  
    let noElement;
    if (result.length >= 10) {
      noElement = 10;
    } else {
      noElement = sortedArray.length;
    }
    var i;
    var threadElement = [];
    for (i = 0; i < noElement; i++) {
      threadElement.push(sortedArray[i]);
    }
    return threadElement;
    /*/
     var sortedReply = threadElement.map(function(currentValue) {
       currentValue.replies.concat().sort(function(a, b) {
       return b.created_on - a.created_on;
     });
      /*/ 
     
        
   
    //return top 3 recent replies
    //get replies for each element in the returnResult
    //re-order replies
    //return the first three replies in the array of replies
  }
  
}

module.exports = ThreadHandler;