/**
 * Created by tamim on 2/18/16.
 */

'use strict';
process.env.NODE_ENV = 'test';
var assert = require('assert');
var should = require('should');
var SignUpBL = require('./StudentSignUp');
var expect = require('chai').expect;
var cleaner = require('../test/utility');
describe('Signs up a student', function () {


    before(cleaner.cleanup);

    describe('sign up the student', function () {
        it('should save a new  User', function (done) {

            var student = {

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
            SignUpBL.signUpStudent(student, function (err) {
                try {
                    assert(!err);
                    done(err);
                } catch (e) {
                    console.log(err);
                    done(err);
                }
            });

                /** This one should be error
                 * cause the student is already saved
                 */


                SignUpBL.signUpStudent(student, function (err) {
                    assert(err);
                    if(err) {
                        console.log("Signing up multiple students with same email");
                    }
                });





        });

    });


});

