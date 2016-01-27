"use strict";
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var Schema = mongoose.Schema;

var tutorSchema = new Schema({

    firstName  : { type: String,required:true},
    lastName   : { type: String,required:true},
    email      : { type: String,required:true},
    passHash   : { type: String,required:true},
    bankName   : { type: String,default:""},
    bankSwift  : { type: String,default:""},
    bankAccount: { type: String,default:""},
    birthDay   : { type: Date ,required:true}

});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Tutor = mongoose.model('Tutor', tutorSchema);

module.exports = new Tutor();