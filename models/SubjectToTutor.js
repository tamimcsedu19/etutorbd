/**
 * Created by tamim on 2/3/16.
 */
/** This is a model of the mapping with tutors email and Subject Expertise **/

"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subjectToTutorSchema = new Schema({

    subject: {type: String, required: true},
    tutorEmail: {type: String, required: true}

});

module.exports = mongoose.model('SubjectToTutor', subjectToTutorSchema);
