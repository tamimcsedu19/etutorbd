/**
 * Created by tamim on 3/14/16.
 */
'use-strict'
var express = require('express');
var router = express.Router();


subjects = {
    availablesubjects: ['C++', 'Java', 'Algebra']

}
router.get('/getavailablesubjects', function (req, res) {
    res.send(subjects);
});

module.exports = router;