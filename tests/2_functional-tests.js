/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Test POST /api/threads/test', function(done) {
        chai.request(server)
        .post('/api/threads/test')        
        .send({
          text: 'test',
          board: 'test',
          delete_password: 'test',
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false,
          replies: [],
          replycount: 0
        })        
        .end(function(err, res) {
         
          assert.equal(res.status, 200);
          expect(res).to.redirect;
          done();
        })       
      });
    });
    
    suite('GET', function() {
      test('Test GET /api/threads/{board} with 10 bumped threads and 3 recent replies and 2 fields are not sent', function(done) {
        chai.request(server)
        .get('/api/threads/test')
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.isAtMost(res.body.length, 10);
          assert.isAtMost(res.body[0].replies.length, 3);
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'board');
          assert.notProperty(res.body[0], 'delete_password');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.notProperty(res.body[0], 'reported');
          assert.property(res.body[0], 'replies');
          assert.property(res.body[0], 'replycount');
          done();
        });
      })
    });
    
        suite('PUT', function() {
      test('Test PUT on /api/threads/{board}, report a thread and change report value to true', function(done) {
        chai.request(server)
        .put('/api/threads/test')
        .send({reported: true})
        .end(function(err, res) {          
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    
    suite('DELETE', function() {
      test('Test DELETE on  /api/threads/{board}', function(done) {
        chai.request(server)
        .get('/api/threads/test')        
        .end(function(err, response) {     
         
          let obj = {
            board: response.body[0].board,
            thread_id: response.body[0]._id,
            delete_password: 'test'
          };
           chai.request(server)          
          
          .delete('/api/threads/test')
          .send(obj)
          .end(function(error, res) {      
           
             assert.equal(res.status, 200);
             assert.deepEqual(res.text, 'success');              
             done();
           })          
        });
      })
    });
    


  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    //initial setup
    suite('POST', function() {
      test('Test POST /api/threads/test', function(done) {
        chai.request(server)
        .post('/api/threads/test')        
        .send({
          text: 'test',
          board: 'test',
          delete_password: 'test',
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false,
          replies: [],
          replycount: 0
        })        
        .end(function(err, res) {         
          assert.equal(res.status, 200);
          expect(res).to.redirect;
          done();
        })       
      });
    });
    
    suite('POST', function() {
        test('Test POST /api/replies/test', function(done) {
        chai.request(server)
        .get('/api/threads/test')        
        .end(function(err, response) {
          //console.log(response.body)
          var obj = {
            board: response.body[0].board,
            text: 'test',
            thread_id: response.body[0]._id,
            delete_password: 'test'
          }
          chai.request(server)
          .post('/api/replies/test')
          .send(obj)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            expect(res).to.redirect;
            done();
          })
        })
    });
    });
    
    suite('GET', function() {
      test('Test GET /api/replies/{board} with all of its replies and 2 fields are not sent', function(done) {
        chai.request(server)
        .get('/api/threads/test')
        .end(function(err, response){
          
          chai.request(server)
          .get('/api/replies/test?thread_id=' + response.body[0]._id )
          .end(function(err, res) {
          
            assert.equal(res.status, 200);
           
            assert.property(res.body.replies[0], 'text');
          
          assert.notProperty(res.body.replies[0], 'delete_password');
          assert.property(res.body.replies[0], 'created_on');
          assert.equal(res.body.replies[0].created_on, response.body[0].bumped_on);
          assert.notProperty(res.body.replies[0], 'reported');         
            //assert.equal(res.body)
            
            done();
          })
        });
      })
    });
    
    suite('PUT', function() {
        test('Test PUT /api/replies/test, text response should be \'success\'', function(done) {
        chai.request(server)
        .get('/api/threads/test')        
        .end(function(err, response) {
          //console.log(response.body)
          var obj = {
            reply_id: response.body[0].replies[0]._id,
            thread_id: response.body[0]._id
            
          }
          chai.request(server)
          .put('/api/replies/test')
          .send(obj)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, 'success');
            done();
          })
        })
    });
    });
    
    suite('DELETE', function() {
            test('Test DELETE on  /api/replies/{board} with the correct return message', function(done) {
        chai.request(server)
        .get('/api/threads/test')        
        .end(function(err, response) {     
          
          let obj = {
            reply_id: response.body[0].replies[0]._id,
            thread_id: response.body[0]._id,
            delete_password: 'test'
          };
           chai.request(server)          
          .delete('/api/replies/test')
          .send(obj)
          .end(function(error, res) {                 
             assert.equal(res.status, 200);
             assert.deepEqual(res.text, 'success');     
             done();
           })          
        });
      })
    });
    
    //final delete
        suite('DELETE', function() {
      test('Test DELETE on  /api/threads/{board}', function(done) {
        chai.request(server)
        .get('/api/threads/test')        
        .end(function(err, response) {          
          let obj = {
            board: response.body[0].board,
            thread_id: response.body[0]._id,
            delete_password: 'test'
          };
           chai.request(server)         
          .delete('/api/threads/test')
          .send(obj)
          .end(function(error, res) {          
             assert.equal(res.status, 200);
             assert.deepEqual(res.text, 'success');              
             done();
           })          
        });
      })
    });
  });

}); 
