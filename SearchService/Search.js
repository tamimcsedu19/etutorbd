/**
 * Created by tamim on 1/27/16.
 */
/** This file contains the logic of Tutor Search after a Student has entered the search key **/
'use strict';
var SubjectToTutorDA = require('./SubjectToTutorDA');
var UserDA = require('../UserService/UserDA')('tutor');

exports.searchBySubject = function (subject, callback)
{
    /**
     * returns an array of object of Tutor type
     *
     * subject is the subject student needs help with
     *
     *
     * returns an array each element of which is a Tutor object
     * matching the students search skills
     *
     */


    /** First call the matching tutors Emails **/

    SubjectToTutorDA.getSubjectTutors(subject, function (err, tutorEmails) {
        /** We have got the matching tutor Emails .
         * Now return the tutor Array for this tutorEmails
         *
         */
        if (err)
            return callback(err, null);
        UserDA.getUsersByEmails(tutorEmails, callback);// Directly passing the callback , if tutors are found it will


        // Called like callback(null,tutors) which is what we want


    });
}
exports.searchOnlineTutors = function (callback) {





}


