/**
 * Created by tamim on 3/14/16.
 */

'use strict';

var search = require('./Search');

process.env.NODE_ENV = 'test';
var assert = require('assert');
var should = require('should');
var expect = require('chai').expect;
var utility = require('../test/utility');
var TutorDA = require('../UserService/UserDA')('tutor');
var subjectToTutor = require('./SubjectToTutorDA');
var async = require('async');
var search = require('./Search');


describe('Searches for tutors', function () {


    before(utility.cleanup);

    describe('Test for tutors', function () {

        it('should save 3 tutors and then test search', function (alldone) {
            utility.insertTutors(function () {

                TutorDA.getUserByEmail("mahfujhowlader@gmail.com", function (err, tutor) {
                    assert(!err);
                    assert(tutor.firstName == "Mahfuj");
                    assert(tutor.fullName=="Mahfuj Howlader")
                    assert(tutor.email == "mahfujhowlader@gmail.com");

                });


                search.searchBySubject('C++',function(err,tutors){
                    assert(tutors[0].email == "mahfujhowlader@gmail.com");

                    alldone();

                });
                


            });


        });

    });


});



