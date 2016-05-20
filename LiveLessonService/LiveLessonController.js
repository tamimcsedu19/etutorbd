/**
 * Created by tamim on 4/2/16.
 */

'use-strict';

var liveLessonDA = require('./LiveLessonDA');


exports.handleClient = function(io,socket){

   socket.on('update',function (data) {

       /** Just checking to send appropriate data **/
       var n_data = {
           liveLessonId: data.liveLessonId,
           user1Chats:data.user1Chats,
           user2Chats:data.user2Chats,
           pages:data.pages
       }

       liveLessonDA.updateLesson(n_data);

       io.to(data.liveLessonId).emit('update',data);



   });

    socket.on('getById',function (data) {

        liveLessonDA.getById(data.liveLessonId,function (err,data) {
            socket.emit('liveLessonData',data);

        });

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

    liveLessonDA.create(liveLessonData);
}