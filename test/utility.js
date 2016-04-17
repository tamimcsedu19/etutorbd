/**
 * Created by tamim on 2/18/16.
 */
'use-strict';
__base = __dirname + '/../'
var TutorDA = require(__base + 'DataAccess/UserDAs/UserDA')('tutor');
var subjectToTutor = require('../SearchService/SubjectToTutorDA');
var Student = require(__base + 'models/Student');
var Tutor = require(__base + 'models/Tutor');
var EmailToType = require(__base + 'models/EmailToType');
var async = require('async');

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


exports.insertTutors = function (alldone) {
    var tutor1 = {
        firstName: "Tamim",
        lastName: "Addari",
        email: "tamim.tamim1382@gmail.com",
        password: "tamimaddari",
        birthDay: Date('1994-09-13'),
        university: "University of Dhaka",
        currentDegree: "Undergraduate",
        majorSubject: "Computer Science",
        expectedGraduation: 2017,
        userType: "tutor"
    };

    var tutor2 = {
        firstName: "Mahfuj",
        lastName: "Howlader",
        email: "mahfujhowlader@gmail.com",
        password: "mahfuj1234",
        birthDay: Date('1994-02-07'),
        university: "University of Dhaka",
        currentDegree: "Undergraduate",
        majorSubject: "Computer Science",
        expectedGraduation: 2017,
        userType: "tutor"
    };

    var tutor3 = {
        firstName: "Rakib",
        lastName: "Ahsan",
        email: "rakib.13th@gmail.com",
        password: "rak13123",
        birthDay: Date('1992-06-07'),
        university: "University of Dhaka",
        currentDegree: "Undergraduate",
        majorSubject: "Computer Science and Engineering",
        expectedGraduation: 2017,
        userType: "tutor"
    };
    var tutor = {

        firstName: "Tamim",
        lastName: "Addari",
        email: "tamim.tamim1382@gmail.com",
        password: "tamimaddari",
        birthDay: Date('1994-09-13'),
        university: "University of Dhaka",
        currentDegree: "Honors",
        majorSubject: "Computer Science",
        expectedGraduation: 2017


    };

    async.waterfall([
        function (done) {
            TutorDA.save(tutor1, function (err) {
                done();

            });

        },
        function (done) {
            TutorDA.save(tutor2, function (err) {
                done();

            });

        },
        function (done) {
            TutorDA.save(tutor3, function (err) {
                done();

            });
        },

        /** Lets give em some subjects **/
            function (done) {
            subjectToTutor.saveSubjectTutor({
                'email': "mahfujhowlader@gmail.com",
                'subject': 'C++'
            }, function () {
                done();
            });

        },
        function (done) {
            subjectToTutor.saveSubjectTutor({
                'email': "mahfujhowlader@gmail.com",
                'subject': 'Algebra'
            }, function () {
                done();
            });

        },
        function (done) {
            subjectToTutor.saveSubjectTutor({
                'email': "tamim.tamim1382@gmail.com",
                'subject': 'Geometry'
            }, function () {
                done();
            });

        },


        /** Now lets test the search option **/



            function (done) {
            alldone();
        }


    ]);


}