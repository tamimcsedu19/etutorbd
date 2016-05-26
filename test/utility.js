/**
 * Created by tamim on 2/18/16.
 */
'use strict';
var __base = __dirname + '/../'
var TutorDA = require('../UserService/UserDA')('tutor');
var subjectToTutor = require('../SearchService/SubjectToTutorDA');
var Student = require('../UserService/StudentModel');
var Tutor = require('../UserService/TutorModel');
var EmailToType = require('../UserService/EmailToTypeModel');
var SubjectToTutor = require('../SearchService/SubjectToTutor');
var EmailToTypeDA = require('../UserService/EmailToTypeDA');
var SubjectToTutorDA = require('../SearchService/SubjectToTutorDA');
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

    var tutors = [];



    tutors.push ({
        firstName: "Mahfuj",
        lastName: "Howlader",
        fullName: "Mahfuj Howlader",
        email: "mahfujhowlader@gmail.com",
        hash: "mahfuj1234",
        birthDay: Date('1994-02-07'),
        university: "University of Dhaka",
        currentDegree: "Undergraduate",
        majorSubject: "Computer Science",
        expectedGraduation: 2017,
        userType: "tutor"
    });


    tutors.push({
        firstName: "Rakib",
        lastName: "Ahsan",
        fullName: "Rakib Ahsan",
        email: "rakib.13th@gmail.com",
        hash: "rak13123",
        birthDay: Date('1992-06-07'),
        university: "University of Dhaka",
        currentDegree: "Undergraduate",
        majorSubject: "Computer Science and Engineering",
        expectedGraduation: 2017,
        userType: "tutor"
    });


    tutors.push({
        firstName: "Sabrina",
        lastName: "Ishita",
        fullName: "Sabrina Zaman Ishita",
        email: "mithilazz@gmail.com",
        hash: "mithila",
        birthDay: Date('1993-06-07'),
        university: "University of Dhaka",
        currentDegree: "Undergraduate",
        majorSubject: "Computer Science and Engineering",
        expectedGraduation: 2017,
        userType: "tutor"

    });

    tutors.push({
        firstName: "Zahin",
        lastName: "Zawad",
        fullName: "Zahin Zawad",
        email: "zahinzawad@gmail.com",
        hash: "zahinn",
        birthDay: Date('1993-06-07'),
        university: "University of Dhaka",
        currentDegree: "Undergraduate",
        majorSubject: "Computer Science and Engineering",
        expectedGraduation: 2017,
        userType: "tutor"

    });

    tutors.push({
        firstName: "Sayeed",
        lastName: "Anwar",
        fullName: "Sayeed Anwar",
        email: "sayeed@gmail.com",
        hash: "sayeed",
        birthDay: Date('1993-06-07'),
        university: "University of Dhaka",
        currentDegree: "Undergraduate",
        majorSubject: "Computer Science and Engineering",
        expectedGraduation: 2017,
        userType: "tutor"

    });


    for (var i in tutors) {
        var tutor = new Tutor(tutors[i]);
        EmailToTypeDA.setUserType(tutor.email,'tutor',function (err) {
            if(err)
                console.log(err);
        });

        SubjectToTutorDA.saveSubjectTutor({
            subject:'C++',
            tutorEmail:tutor.email
        });
        SubjectToTutorDA.saveSubjectTutor({
            subject:'Java',
            tutorEmail:tutor.email
        });
        SubjectToTutorDA.saveSubjectTutor({
            subject:'Algebra',
            tutorEmail:tutor.email
        });
        tutor.save(function (err) {
            if(err)
                console.log(err);
        });

    }
    alldone();




}

exports.insertTutors(function () {});