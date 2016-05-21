/**
 * Created by tamim on 4/16/16.
 */
var should = require('should');
var io = require('socket.io-client');
var controller = require('./ChatController');
var utility = require('./ChatTestUtility');
var assert = require('assert');
process.env.NODE_ENV = 'test';


describe('Tests chatting functionality', function () {


    before(utility.insertMessages);

    var client1 = null;
    var client2 = null;
    var socketURL = "http://localhost:3001";
    var options = {
        transports: ['websocket'],
        'force new connection': true
    };


    describe('Tests message passing', function () {


        before(function () {
            client1 = io.connect(socketURL, options);
            client2 = io.connect(socketURL, options);

            client1.on('connect', function () {
                client1.emit('create', {user_id: 'tamim.tamim1382@gmail.com'});
            });
            client2.on('connect', function () {
                client2.emit('create', {user_id: 'rakib13th@yahoo.com'});
            });


        });

        it('Should Check correct messages retrieved', function (done) {

            var offset = 'ffffffffffffffffffffffff';
            var cnt = 0;
            client1.on('historyMessages', function (data) {

                assert(data.id.toUserId == "rakib13th@yahoo.com");
                
                assert(data.messages.length == 1); // 1 page requested
                offset = data.messages[data.messages.length-1]._id;
                cnt++;

                if(cnt == 2){
                    assert(offset < 'ffffffffffffffffffffffff');
                    done();
                }
                else {
                    client1.emit('retrieveMessages', {
                        toUserId: 'rakib13th@yahoo.com',
                        fromUserId: 'tamim.tamim1382@gmail.com',
                        pageSize: 1,
                        offset: offset

                    });
                }



            });

            /** Retrieves the messages between toUserId and fromUserId **/

            client1.emit('retrieveMessages', {
                toUserId: 'rakib13th@yahoo.com',
                fromUserId: 'tamim.tamim1382@gmail.com',
                pageSize: 1,
                offset: offset

            });
            /** The offset is required for pagination , when declared the first offset is highest number possible
             *
                **/
        });

        it('Should check if message can be sent successfully', function (done) {


            client1.on('message', function (data) {


                assert(data.from == "rakib13th@yahoo.com");
                assert(data.message == "How are you");
                done();


            });


            client2.emit('message', {
                from: 'rakib13th@yahoo.com',
                to: 'tamim.tamim1382@gmail.com',
                message: "How are you",
                timeStamp: 5

            });

        });

    });


});



