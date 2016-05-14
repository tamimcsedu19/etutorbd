/**
 * Created by tamim on 2/18/16.
 */
'use-strict';
__base = __dirname + '/../'
var TutorDA = require('../UserService/UserDA')('tutor');
var subjectToTutor = require('../SearchService/SubjectToTutorDA');
var Student = require('../UserService/StudentModel');
var Tutor = require('../UserService/TutorModel');
var EmailToType = require('../UserService/EmailToTypeModel');
var SubjectToTutor = require('../SearchService/SubjectToTutor');
var EmailToTypeDA = require('../UserService/EmailToTypeDA');
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
            console.log("Successfully cleared EmailToType students Collection\n");
        }
        else {

            console.log("error clearing EmailToType during test");
        }
    });

    SubjectToTutor.remove({}, function (err) {
        if (!err) {
            console.log("Successfully cleared SubjectToTutor students Collection\n");
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
        hash: "tamimaddari",
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
        hash: "mahfuj1234",
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
        hash: "rak13123",
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
        hash: "tamimaddari",
        birthDay: Date('1994-09-13'),
        university: "University of Dhaka",
        currentDegree: "Honors",
        majorSubject: "Computer Science",
        expectedGraduation: 2017


    };

    async.waterfall([
        function (done) {
            EmailToTypeDA.setUserType(tutor2.email,'tutor',function(err) {
                TutorDA.save(tutor2, function (err) {
                    done();
                });
            });


        },
        function (done) {
            EmailToTypeDA.setUserType(tutor3.email,'tutor',function(err) {
                TutorDA.save(tutor3, function (err) {
                    done();
                });
            });


        },

        /** Lets give em some subjects **/
            function (done) {
            subjectToTutor.saveSubjectTutor({
                'tutorEmail': "mahfujhowlader@gmail.com",
                'subject': 'C++'
            }, function () {
                done();
            });

        },
        function (done) {
            subjectToTutor.saveSubjectTutor({
                'tutorEmail': "mahfujhowlader@gmail.com",
                'subject': 'Algebra'
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