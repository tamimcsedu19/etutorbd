/**
 * Created by tamim on 2/18/16.
 */
"use strict";
var mongoose = require("../DataAccess/DbConnection");
var Schema = mongoose.Schema;
var SchemaFunctions = require('./SchemaFunctions');
var studentSchema = new Schema({


    firstName: {type: String, required: true, maxlength: 20},
    lastName: {type: String, required: true, maxlength: 20},
    email: {type: String, required: true, maxlength: 40, unique: true},
    password: {type: String, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    ActivationToken: String,
    isActivated: {type: Number, default: 0},
    userType: {type: String, required: true, maxlength: 10},
    AccountBalance: {type: Number, default: 0},
    salt : String

});


studentSchema.pre('save', SchemaFunctions.hashPassword);

studentSchema.methods.comparePassword = SchemaFunctions.comparePassword;

var Student = mongoose.model('Student', studentSchema);
module.exports = Student;