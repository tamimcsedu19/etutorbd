/**
 * Created by tamim on 4/16/16.
 */


"use strict";
var mongoose = require("../DataAccess/DbConnection");
var Schema = mongoose.Schema;


var messageSchema = new Schema({

    to: {type: String, required: true, maxlength: 40},
    from: {type: String, required: true, maxlength: 40},
    message: {type: String, required: true, maxlength: 1024},
    timeStamp: {type: Number},
    sampleName: {type: String, maxlength: 10}

});


var Message = mongoose.model('Message', messageSchema);
module.exports = Message;