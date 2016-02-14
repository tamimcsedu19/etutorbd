/**
 * Created by tamim on 2/9/16.
 */
"use strict";
var mongoose = require('mongoose');
var connection = require('./DbConnection');
var Tutor = require('./../models/Tutor');

module.exports = {

    save: function (tutorGiven, callback) {

        var tutor = new Tutor(tutorGiven);
        tutor.save(function (err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },

    getTutor: function (email, callback) {
        Tutor.findOne({email: email}, function (err, foundTutor) {
            if (err)
                return callback(err, null);

            return callback(null, foundTutor);

        });


    },
    getTutorByResetLink: function (resetLink, callback) {
        Tutor.findOne({resetPasswordToken: resetLink, resetPasswordExpires: {$gt: Date.now()}}, callback);


    }
}