/**
 * Created by tamim on 4/17/16.
 */

var SubjectToTutorDA = require('../SearchService/SubjectToTutorDA');
var express = require('express');
var router = express.Router();

router.get('/search', function (req, res) {

    var subject = req.query.subject;
    SubjectToTutorDA.getSubjectTutors(subject,function (err,tutors) {
        res.send(tutors);

    });

});

subjects = {
    availablesubjects: ['C++', 'Java', 'Algebra','Geometry']

}

router.get('/getavailablesubjects', function (req, res) {
    res.send(subjects);
});



module.exports = router;