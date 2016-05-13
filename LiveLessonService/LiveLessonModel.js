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

    tutor: {type: String, required: true, maxlength: 40},
    student: {type: String, required: true, maxlength: 40},
    chats : {type: Array},
    timeStamp: {type: Number},
    sampleName: {type: String, maxlength: 10}

});


var Message = mongoose.model('Message', messageSchema);
module.exports = Message;