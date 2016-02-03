"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tutorSchema = new Schema({

    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    passHash: {type: String, required: true},
    bankName: {type: String, default: ""},
    bankSwift: {type: String, default: ""},
    bankAccount: {type: String, default: ""},
    birthDay: {type: Date, required: true},
    university: {type: String, required: true},
    currentDegree: {type: String, required: true},
    subject: {type: String, required: true}

});

var Tutor = mongoose.model('Tutor', tutorSchema);
module.exports = new Tutor();