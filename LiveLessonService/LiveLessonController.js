/**
 * Created by tamim on 4/2/16.
 */

'use-strict';

var liveLessonDA = require('./LiveLessonDA');
var ChatDALive = require("../ChatService/ChatDA")("Live");
var redis = require("redis"),
    redisClient = redis.createClient();
redisClient.on("error", function (err) {
    console.log("Error " + err);
});


var appendSessionAttrib = "liveLessonId";
exports.handleClient = function(io,socket,EventEmitter){
    EventEmitter.on('crazy',function () {
        console.log("inside crazy");
    });


    socket.on('messageLive', function (data) {

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


        io.to(data.to).emit('messageLive', message); // Send the message to the reciever

        ChatDALive.saveMessage(message);


    });



    socket.on('update',function (data) {

       /** Just checking to send appropriate data **/
       var n_data = {
           liveLessonId: data.liveLessonId,
           pages:data.pages
       }

       liveLessonDA.updateLesson(n_data);

       io.to(data.liveLessonId).emit('update',data);



   });

    socket.on('getById',function (data) {

        console.log(data);
        search_data = {
            liveLessonId:data.liveLessonId

        }
        liveLessonDA.getById(search_data,function (err,data) {
            
            socket.emit('liveLessonData',data);

        });

    });
    /** Nodejs Event emitter **/
    EventEmitter.on("endLiveLesson",function (data) {
        console.log("ending live lesson");
        console.log(data);
        var key1 = data.to+appendSessionAttrib,key2 = data.from+appendSessionAttrib;


        io.to(data.to).emit('endLiveLesson',{});
        io.to(data.from).emit('endLiveLesson',{});
        redisClient.del(key1);
        redisClient.del(key2);

    });


    socket.on('endLiveLesson',function (data) {
        EventEmitter.emit("endLiveLesson",data);
    });






}


exports.initLiveLesson = function (liveLessonData) {


    /**
    liveLessonData is like {


        liveLessonId:p_liveLessonData.id,
        user1: data.to,
        user2: data.from,
        startTimeStamp: new Date().now(),
        liveLessonLength : 0
    }

     **/
    console.log(liveLessonData);
    liveLessonDA.create(liveLessonData);
}