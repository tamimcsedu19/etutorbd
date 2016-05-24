/**
 * Created by tamim on 5/20/16.
 */
/**
 * Created by tamim on 4/17/16.
 */

var TutorFeaturesController = require('./TutorFeaturesController');
var express = require('express');
var router = express.Router();

router.get('/getsometutors', function (req, res) {


    TutorFeaturesController.getSampleTutors(function (err,tutors) {
        res.send(tutors);
    });

});


module.exports = router;