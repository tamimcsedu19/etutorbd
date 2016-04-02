/**
 * Created by tamim on 3/14/16.
 */

'use strict';
global.__base = __dirname + '/../../';

var search = require(__base + 'BLL/Search');

process.env.NODE_ENV = 'test';
var assert = require('assert');
var should = require('should');
var expect = require('chai').expect;
var utility = require('../utility');
var TutorDA = require(__base + 'DataAccess/UserDAs/UserDA')('tutor');
var subjectToTutor = require(__base + 'DataAccess/SubjectToTutorDA');
var async = require('async');


describe('Searches for tutors', function () {


    before(utility.cleanup);

    describe('Test for tutors', function () {

        it('should save 3 tutors and then test search', function (alldone) {
            utility.insertTutors(function () {

                TutorDA.getUserByEmail("tamim.tamim1382@gmail.com", function (err, tutor) {
                    assert(!err);
                    assert(tutor.firstName == "Tamim");
                    assert(tutor.email == "tamim.tamim1382@gmail.com");
                    alldone();

                });

            });


        });

    });


});



