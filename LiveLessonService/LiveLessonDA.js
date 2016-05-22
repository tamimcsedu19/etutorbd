/**
 * Created by tamim on 5/16/16.
 */

'use-strict'
var LiveLessonModel = require('./LiveLessonModel');

exports.create = function(initialData){
    var liveLessonModel = new LiveLessonModel(initialData);
    liveLessonModel.save(function (err) {
        console.log(initialData);
        console.log("saved successfully");
    });
}

exports.getById = function (data,callback) {



    LiveLessonModel.find({liveLessonId:data.liveLessonId},function (err,liveLessonData) {
        console.log("inside getByIdDA");
        console.log(liveLessonData);

        if(err)
            callback(err);
        callback(null,liveLessonData);

    });

}

exports.updateLesson = function(data){

    var conditions = { liveLessonId: data.liveLessonId }
        , update = data;

    LiveLessonModel.update(conditions,update);

}