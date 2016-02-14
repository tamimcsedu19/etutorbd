"use strict";
var mongoose = require("../DataAccess/DbConnection");
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var tutorSchema = new Schema({

    firstName: {type: String, required: true, maxlength: 20},
    lastName: {type: String, required: true, maxlength: 20},
    email: {type: String, required: true, maxlength: 40, unique: true, index: true},
    password: {type: String, required: true},
    /**
     bankName: {type: String, default: "" , maxlength: 50},
     bankSwift: {type: String, default: "" , maxlength: 50},
     bankAccountNo: {type: String, default: "" , maxlength: 50},
     birthDay: {type: Date, required: true },
     university: {type: String, required: true, maxlength: 30},
     currentDegree: {type: String, required: true , maxlength: 30},
     majorSubject: {type: String, required: true , maxlength: 40},
     userType: {type: String,required:true,maxlength:10},
     expectedGraduation: {type: Number , required:true }
     **/
});

tutorSchema.pre('save', function (next) {
    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {

        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });


    });

});

tutorSchema.methods.comparePassword = function (candidatePassword, cb) {

    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



var Tutor = mongoose.model('Tutor', tutorSchema);
module.exports = Tutor;