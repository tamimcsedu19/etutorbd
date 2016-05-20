/**
 * Created by tamim on 5/16/16.
 */

'use-strict'
var LiveLessonModel = require('./LiveLessonModel');

exports.create = function(initialData){
    var liveLessonModel = new LiveLessonModel(initialData);
    liveLessonModel.save();
}

exports.getById = function (liveLessonId,callback) {


    LiveLessonModel.find({liveLessionId:liveLessonId},function (err,data) {
        if(err)
            callback(err);
        callback(null,data);

    });

}

exports.updateLesson = function(data){

    var conditions = { liveLessonId: data.liveLessonId }
        , update = data;

    LiveLessonModel.update(conditions,update);

}