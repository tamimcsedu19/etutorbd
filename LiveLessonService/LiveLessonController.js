/**
 * Created by tamim on 4/2/16.
 */

'use strict';

var liveLessonDA = require('./LiveLessonDA');


exports.handleClient = function(io,socket){

   socket.on('update',function (data) {







   });



}


exports.initLiveLesson = function (liveLessonData) {
    liveLessonDA.create(liveLessonData);
}