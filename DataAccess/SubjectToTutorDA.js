/**
 * Created by tamim on 2/9/16.
 */
var mongoose = require('mongoose');
var connection = require('./DbConnection');

var SubjectToTutor = require('./../models/SubjectToTutor');


module.exports = {

    saveSubjectTutor: function (SubjectToTutorData, callback) {

        var subjectToTutor = new SubjectToTutor(SubjectToTutorData);
        subjectToTutor.save(function (err) {
            if (err) {
                return callback(err);

            }
            return callback();
        });


    }
    ,
    getSubjectTutors: function (subject, callback) {

        var tutors = SubjectToTutor.find({subject: subject}, function (err, tutors) {
            if (err)
                callback(err, null);
            else {

                console.log(tutors);
                callback(null, tutors);
            }

        });


    }
    


}