/**
 * Created by tamim on 2/18/16.
 */
"use strict";
var mongoose = require("../DataAccess/DbConnection");
var Schema = mongoose.Schema;
var SchemaFunctions = require('./SchemaFunctions');
var studentSchema = new Schema({


    firstName: {type: String , maxlength: 20},
    lastName: {type: String  , maxlength: 20},
    fullName: {type: String  , maxlength: 40},
    email: {type: String, required: true, maxlength: 40, unique: true},
    hash: {type: String, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    ActivationToken: String,
    isActivated: {type: Number, default: 0},
    userType: {type: String, required: true, maxlength: 10},
    Balance: {type: Number, default: 0},
    salt : String,
    isOnline: {type: Boolean,default:false},
    liveLessonId: String

});



var Student = mongoose.model('Student', studentSchema);
module.exports = Student;