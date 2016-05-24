"use strict";
var mongoose = require("../DataAccess/DbConnection");
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var SchemaFunctions = require('./SchemaFunctions');

var tutorSchema = new Schema({

    firstName: {type: String, maxlength: 20},
    lastName: {type: String, maxlength: 20},
    fullName: {type: String,maxlength:40},
    email: {type: String, required: true, maxlength: 40, unique: true},
    hash: {type: String, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    balance:{type:Number,default:0},
    userType: {type: String, required: true, maxlength: 10},
    bankName: {type: String, default: "", maxlength: 50},
    bankSwift: {type: String, default: "", maxlength: 50},
    bankAccountNo: {type: String, default: "", maxlength: 50},
    birthDay: {type: Date, required: true},
    university: {type: String, required: true, maxlength: 30},
    //Todo: insert enum of values
    currentDegree: {type: String, required: true, maxlength: 30},
    majorSubject: {type: String, required: true, maxlength: 40},
    expectedGraduation: {type: Number, required: true},
    isOnline: {type: Boolean,default:false},
    liveLessonId: String

});





var Tutor = mongoose.model('Tutor', tutorSchema);
module.exports = Tutor;