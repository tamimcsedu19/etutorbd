/**
 * Created by tamim on 5/13/16.
 */
/**
 * Created by tamim on 4/16/16.
 */


"use strict";
var mongoose = require("../DataAccess/DbConnection");
var Schema = mongoose.Schema;


var liveLessonSchema = new Schema({


    liveLessonId:  {type: String, required: true, maxlength: 15},
    to:      {type: String, required: true, maxlength: 40},
    from:      {type: String, required: true, maxlength: 40},
    startTimeStamp: {type: Number}, //In milliseconds
    liveLessonLength: {type: Number},


});


var LiveLesson = mongoose.model('liveLesson', liveLessonSchema);

module.exports = LiveLesson;
