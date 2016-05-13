/**
 * Created by tamim on 4/17/16.
 */

var search = require('./Search');
var express = require('express');
var router = express.Router();

router.get('/search', function (req, res) {

    var subject = req.query.subject;
    search.searchBySubject(subject,function (err,tutors) {
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