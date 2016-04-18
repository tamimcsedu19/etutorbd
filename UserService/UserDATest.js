/**
 * Created by tamim on 2/18/16.
 */

/**
 * User DA
 **/
'use strict';
process.env.NODE_ENV = 'test';
var assert = require('assert');
var should = require('should');
var TutorDA = require('./UserDA')('tutor');
var StudentDA = require('./UserDA')('student');

var Tutor = require('./TutorModel');
var Student = require('./StudentModel');
var expect = require('chai').expect;


/**
 * todo
 * Tests for other functions such as findByResetLink
 */

describe('User Database Actions', function () {


    before(function () {

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

    });

    describe('save', function () {
        it('should save a new  User', function (done) {

            var tutor = {

                firstName: "Tamim",
                lastName: "Addari",
                email: "tamim.tamim1382@gmail.com",
                password: "tamimaddari",
                birthDay: Date('1994-09-13'),
                university: "University of Dhaka",
                currentDegree: "Honors",
                majorSubject: "Computer Science",
                expectedGraduation: 2017,
                userType: "tutor"

            };
            TutorDA.save(tutor, function (err) {


                try {
                    assert(!err);

                } catch (e) {
                    console.log(err);
                    return done(err);

                }
                console.log("Saved " + tutor);

                TutorDA.getUserByEmail("tamim.tamim1382@gmail.com", function (err, tutor) {
                    assert(!err);
                    assert(tutor.firstName == "Tamim");
                    assert(tutor.email == "tamim.tamim1382@gmail.com");
                    done();

                });


            });


        });

        it('should save a new  Student', function (done) {

            var student = {

                firstName: "Tamim",
                lastName: "Addari",
                email: "tamim.tamim1382@gmail.com",
                password: "tamimaddari",
                birthDay: Date('1994-09-13'),
                university: "University of Dhaka",
                currentDegree: "Honors",
                majorSubject: "Computer Science",
                expectedGraduation: 2017,
                userType: "student"

            };
            StudentDA.save(student, function (err) {

                try {
                    assert(!err);

                } catch (e) {
                    console.log(err);
                    return done(err);

                }

                StudentDA.getUserByEmail("tamim.tamim1382@gmail.com", function (err, student) {
                    assert(!err);
                    assert(student.firstName == "Tamim");
                    assert(student.email == "tamim.tamim1382@gmail.com");
                    done();

                });


            });


        });


    });


});

