/**
 * Created by tamim on 4/16/16.
 *
 */

'use-strict';

var ChatDA = require('./ChatDA');
var redis = require("redis"),
    redisClient = redis.createClient();
redisClient.on("error", function (err) {
    console.log("Error " + err);
});


var appendSessionAttrib = "liveLessonId";



var shortid = require('shortid');
var liveLessonController = require('../LiveLessonService/LiveLessonController');

exports.handleClient =  function (io,socket) {

    console.log('A user has connected to the socket');


    socket.on('message', function (data) {

        /** TODO :: Implement token authorization with redis
         *  data.token
         *  data.from
         * **/

        var message = {
            to: data.to,
            from: data.from,
            message: data.message,
            senderName: data.senderName,
            timeStamp: data.timeStamp,


        };


        io.to(data.to).emit('message', message); // Send the message to the reciever

        ChatDA.saveMessage(message);


    });

    socket.on('create', function (data) {

        console.log('Room creating with user_id: ' + data.user_id);
        socket.user_id = data.user_id;
        socket.join(data.user_id); // Id of the user  possibly email


    });


    socket.on('retrieveMessages', function (data) {

        ChatDA.retrieveMessages(data, function (error, docs) {
            socket.emit('historyMessages', {
                id: data,
                messages: docs

            });
        });

    });

    socket.on('liveSessionOffer', function (data) {

        var liveLessonId = shortid.generate();


        //TODO check if the user is already in session , may be in the client side

        var key1 = data.to+appendSessionAttrib,key2 = data.from+appendSessionAttrib;
        redisClient.set(key1,liveLessonId,redis.print);
        redisClient.set(key2,liveLessonId,redis.print);

        io.to(data.to).emit('liveSessionOffer', data);



    });

    /** This one starts the live lesson **/
    socket.on('liveSessionReply',function(data){

        var key1 = data.to+appendSessionAttrib,key2 = data.from+appendSessionAttrib;

        redisClient.get(key1, function(err, liveLessonId1) {
            redisClient.get(key2,function (err,liveLessonId2) {
                if(data.reply == 1 && liveLessonId1 == liveLessonId2)
                {

                    var liveLessonData = {
                        liveLessonId:liveLessonId1,
                        user1: data.to,
                        user2: data.from,
                        startTimeStamp: new Date().now(),
                        liveLessonLength : 0
                    };

                    liveLessonController.initLesson(liveLessonData);
                    io.to(data.to).join(liveLessonId1);
                    io.to(data.from).join(liveLessonId2);
                    
                    io.to(data.to).emit('initLiveLesson',liveLessonData);
                    io.to(data.from).emit('initLiveLesson',liveLessonData);
                }
                /** TODO:: Delete key from redis **/



            });
        });

    });


    socket.on('disconnect', function (data) {
        console.log(io.sockets.adapter.rooms);
        socket.leave(socket.user_id);
        console.log(io.sockets.adapter.rooms);

    });




}


