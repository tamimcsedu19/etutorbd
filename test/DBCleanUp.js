/**
 * Created by tamim on 2/18/16.
 */
process.env.NODE_ENV = 'test';
var Tutor = require('../models/Tutor');
var Student = require('../models/Student');
var EmailToType = require('../models/EmailToType');

exports.cleanup = function () {

    Tutor.remove({}, function (err) {
        if (!err) {
            console.log("Successfully cleared tutors Collection\n");
        }
        else {

            console.log("error clearing tutors during test");
        }
    });

    Student.remove({}, function (err) {
        if (!err) {
            console.log("Successfully cleared students Collection\n");
        }
        else {

            console.log("error clearing students during test");
        }
    });

    EmailToType.remove({}, function (err) {
        if (!err) {
            console.log("Successfully EmailToType students Collection\n");
        }
        else {

            console.log("error clearing EmailToType during test");
        }
    });

}
