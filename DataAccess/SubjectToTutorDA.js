/**
 * Created by tamim on 2/9/16.
 */
var mongoose = require('mongoose');
var connection = require('./DbConnection');

var SubjectToTutor = require('./../models/SubjectToTutor');


module.exports = {

    save: function (SubjectToTutorData, callback) {

        var subjectToTutor = new SubjectToTutor(SubjectToTutorData);
        subjectToTutor.save(function (err) {
            if (err) {
                return callback(err);

            }
            return callback();
        });


    }


}