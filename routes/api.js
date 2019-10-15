  /*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

var express = require ('express');
var app = express();
//bodyparser
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedParser);


var ThreadHandler = require('../controllers/handler.js');
var mongo = require('mongodb');
var mongoose = require('mongoose');
let DB_STRING = process.env.DB;
mongoose.connect(DB_STRING, {useNewUrlParser: true, useFindAndModify: false,  useUnifiedTopology: true });

//Import  model.js
var model = require('../models/model.js');


module.exports = function (app) {
  
  var threadHandler = new ThreadHandler();
  
  app.route('/api/threads/:board')
  
    .post(function(req, res) {
      var board = req.params.board;      
      var data = req.body;     
      var saveThread = threadHandler.saveThread(data);     
     return res.redirect('/b/' + board + '/');
    })
  
    .get(function(req, res){     
    var searchObj = req.params;
    var option = {sort: {bumped_on: -1}, limit: 10};
    var projection = {reported: 0, delete_password: 0, replies: {$slice: 3}}//'-reported, -delete_password';
    // when finding a general thread
    if (searchObj.board == "general") {
       model.find({}, projection, option, function(err, result) {         
         res.send(result);
         
         //threadHandler.returnArray(result)
      //return res.send(threadHandler.returnThreadArray(result));
    });
    } else {
      //when finding a specific thread
    model.find(searchObj, projection, option, function(err, result) {
      res.send(threadHandler.returnArray(result));
      //return res.send(threadHandler.returnThreadArray(result));
    });
    }
    
  })
    .put(function(req, res){
    var searchObj = {
      board: req.body.board,
      _id: req.body.thread_id
    };
    var updateField = {
      reported: true
    }
    model.findOneAndUpdate(searchObj, updateField, {new: true}, function(err, result) {
      
      if (err) {
        return res.send('Error trying to report thread')
      } else {
        return res.send('success');
      }       
    });
  })
  
    .delete(function(req, res){
    //
    var searchObj = {
      board: req.body.board,
      _id: req.body.thread_id,
      delete_password: req.body.delete_password
    };
    
    var password = req.body.delete_password;
    
  
    //
    model.findOne(searchObj, function(err, result) {
      
       if (err) {
        return res.send('error trying to initiate delete');
      } else if (!result) {
                 return res.send('no such thread exist')
                 } else if (result.delete_password !== req.body.delete_password) {
        return res.send('incorrect password');
      } else {
        result.remove();
        return res.send('success');
      }  
    })
    //
    //Enablign the following code deletes items in database after filling and submitting the delete thread section
    /*/
    model.deleteMany(function(err){});
    /*/
  });
  
  
  app.route('/api/replies/:board')
    .post(function(req, res) {
      var board = req.params.board;  
      var id = req.body.thread_id
      var data = req.body;   
      var agreeableDate = new Date();
      var dataPush = {
        text: data.text,
        created_on: agreeableDate,
        delete_password: data.delete_password,
        deleted: false
      }
    //find the specific thread
      model.findById(id, function(err, data) {
        data.bumped_on = agreeableDate;
        data.replycount++;
        data.replies.push(dataPush);
        data.save(function (err) {
          if (err) {return res.send("Error trying to initiate search")} else {
              return res.redirect('/b/' + board + '/' + id);   
          }
        })
      });    
    })
  
    .get(function(req, res){
    let id = req.query.thread_id;
    var projection = {"replies.reported": 0, "replies.delete_password": 0};
    model.findById(id, projection, function(err, data) {  
      
      if (err) {
        return res.send("Error trying to initiate search")
      } else {
        return res.send(data);
      }
    })
   
   })
    .put(function(req, res){
   let thread_id = req.body.thread_id;
   let reply_id = req.body.reply_id;
   model.findById(thread_id, function(err, result) {
     if (err) {
        return res.send('error trying to delete');
      } else if (!result) {
            return res.send('cannot find this thread2');
            } else {
              var findReply = result.replies.id(reply_id);
              if (!findReply) {
                return res.send("No reply with such ID is found")
              } else {
                findReply.reported = true;
                result.save(function(err, data) {
                   if (err) {
                    return res.send('error trying to save');
                            } else {
                              return res.send("success");
                            }
                })
              }
            }
   }) 
  })
  
    .delete(function(req, res){
      var body = req.body;
      var threadId = body.thread_id;    
      var searchRepObj = {
        _id: body.reply_id,
        delete_password: body.delete_password
      }
      var replaceField = {
        text: "[deleted]"
      }
    model.findById(threadId, function(err, result) {      
       if (err) {
        return res.send('error trying to delete');
      } else if (!result) {
            return res.send('cannot find this thread2');
            } else {
            var findReply = result.replies.id(searchRepObj._id);
              if (!findReply) {
                return res.send("No reply with such ID is found")
              } else if(findReply.delete_password !== body.delete_password) {
                return res.send('incorrect password')
              } else {
                findReply.text = "[deleted]";
              result.save(function(err, data) {
                if (err) {
                  return res.send('error trying to delete');
                } else {
                   return res.send("success");
                }                
              });
              }              
      }  
    })
    
  });

};
