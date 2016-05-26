/*
 * Created by tamim on 4/2/16.
*/

'use strict';

var liveLessonDA = require('./LiveLessonDA');
var ChatDALive = require("../ChatService/ChatDA")("Live");
var redis = require("redis"),
    redisClient = redis.createClient();
redisClient.on("error", function (err) {
    console.log("Error " + err);
});

var cnt = 0;
var EmailToTypeDA = require('../UserService/EmailToTypeDA');

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

       io.to(data.to).emit('update',data);



   });

    socket.on('getById',function (data) {

        console.log(data);
        var search_data = {
            liveLessonId:data.liveLessonId

        }
        liveLessonDA.getById(search_data,function (err,data) {
            
            socket.emit('liveLessonData',data);

        });

    });




    /** LiveLesson End functions **/
















    /** Nodejs Event emitter **/






    EventEmitter.on("endLiveLesson",function (data) {

        ++cnt;
        console.log('End Lesson Call cnt: '+cnt);

        EmailToTypeDA.getUserType(data.to,function (err,EmailType) {
            var userType = EmailType.userType;

            // data has a field called liveLessonId
            liveLessonDA.getById(data,function (err,liveLessonData) {

                var startTime = liveLessonData.startTimeStamp;
                console.log('startTime: '+startTime)
                var curTime = Date.now();
                console.log('curTime: '+curTime);
                var totalTimeMinutes = (curTime-startTime)/(60.00*1000.00);
                var studentCut = totalTimeMinutes*(500.0/60);
                var ourCut = .15 * studentCut;
                var tutorCut = studentCut-ourCut;


                console.log(totalTimeMinutes);
                var TutorDA = require('../UserService/UserDA')('tutor');
                var StudentDA = require('../UserService/UserDA')('student');

                var studentUpdate,tutorUpdate;
                var tutorEmail,studentEmail;

                if(userType == "tutor") {
                    studentEmail = data.from;
                    tutorEmail = data.to;

                }
                else {
                    studentEmail = data.to;
                    tutorEmail = data.from;
                }
                console.log(tutorCut);

                studentUpdate =  { '$inc': { balance: -studentCut } };
                tutorUpdate   =  { '$inc': { balance: +tutorCut } };

                console.log('updating '+tutorEmail);
                TutorDA.update({email:tutorEmail},tutorUpdate,function (err) {
                    console.log(err);
                });

                console.log('updating '+studentEmail);
                console.log(studentUpdate);
                StudentDA.update({email:studentEmail},studentUpdate,function (err) {
                    console.log(err);
                });


            });





        });




        console.log("ending live lesson");
        console.log(data);
        var key1 = data.to+appendSessionAttrib,key2 = data.from+appendSessionAttrib;


        io.to(data.to).emit('endLiveLesson',{});
        io.to(data.from).emit('endLiveLesson',{});
        redisClient.del(key1);
        redisClient.del(key2);





    });



    socket.on('findBalance',function(data){

        var userId = data.user_id;


        EmailToTypeDA.getUserType(data.to,function (err,EmailType) {
            var userType = EmailType.userType;
            var UserDA =  require('../UserService/UserDA')(userType);
            UserDA.getUserByEmail(userId,function (err,user) {

                if(err)
                    console.log(err);
                else {
                    data.balance = user.balance;
                    socket.emit('Balance',data);


                }

            });


        });



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