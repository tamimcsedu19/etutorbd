/**
 * Created by tamim on 4/16/16.
 *
 */

'use strict';

var ChatDA = require('./ChatDA')('normal');
var redis = require("redis"),
    redisClient = redis.createClient();
redisClient.on("error", function (err) {
    console.log("Error " + err);
});




var appendSessionAttrib = "liveLessonId";



var shortid = require('shortid');
var liveLessonController = require('../LiveLessonService/LiveLessonController');

exports.handleClient =  function (io,socket,EventEmitter) {

    EventEmitter.emit('crazy');

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
        io.sockets.emit('isOnline',data);

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



        var key1 = data.to+appendSessionAttrib,key2 = data.from+appendSessionAttrib;


        
        var liveLessonId = shortid.generate();



        console.log(data);
        //TODO: check if the user is already in session , may be in the client side
        //Done
        var key1 = data.to+appendSessionAttrib,key2 = data.from+appendSessionAttrib;
        redisClient.get(key1, function(err, liveLessonId1) {
            redisClient.get(key2,function (err,liveLessonId2) {
                console.log("here");
                console.log(liveLessonId1);
                console.log(liveLessonId2);

                if(liveLessonId1 || liveLessonId2)
                    return;

                redisClient.set(key1,liveLessonId,redis.print);
                redisClient.set(key2,liveLessonId,redis.print);


                socket.join(liveLessonId);

                io.to(data.to).emit('liveSessionOffer', data);

            });
        });




    });
    
    


    /** This one starts the live lesson **/
    socket.on('liveSessionReply',function(data){

        var key1 = data.to+appendSessionAttrib,key2 = data.from+appendSessionAttrib;

        console.log(data);
        redisClient.get(key1, function(err, liveLessonId1) {
            redisClient.get(key2,function (err,liveLessonId2) {
                if(data.reply == 1 && liveLessonId1 == liveLessonId2)
                {


                    var liveLessonData = {
                        liveLessonId:liveLessonId1,
                        to: data.to,
                        from: data.from,
                        startTimeStamp: Date.now(),
                        liveLessonLength : 0
                    };

                    liveLessonController.initLiveLesson(liveLessonData);


                    socket.join(liveLessonId1);

                    /** Sends each of the client only the Id of the livelesson so that
                     * after redirecting through angularjs , they can get all the necessary data
                     * through getting.
                     */

                    redisClient.lpush(liveLessonId1,data.to,data.from);
                    socket.liveLessonId = liveLessonId1;

                    io.to(data.to).emit('initLiveLesson',{liveLessonId:liveLessonId1});
                    io.to(data.from).emit('initLiveLesson',{liveLessonId:liveLessonId1});
                }
                /** TODO:: Delete key from redis **/



            });
        });

    });


    socket.on('disconnect', function (data) {

        io.sockets.emit('isOffline',{user_id:socket.user_id});

        socket.leave(socket.user_id);
        if(!socket.liveLessonId){
            socket.leave(socket.user_id);
            return;
        }

        io.to(socket.liveLessonId).emit('endLiveLesson');

        redisClient.lrange(socket.liveLessonId,0,1,function(err, reply) {
            var data = {
                to:reply[0],
                from:reply[1],
                liveLessonId:socket.liveLessonId
            };

            
            EventEmitter.emit('endLiveLesson',data);
        });






    });




}


