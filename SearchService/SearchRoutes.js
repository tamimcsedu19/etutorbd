/**
 * Created by tamim on 4/17/16.
 */

var search = require('./Search');
var express = require('express');
var router = express.Router();
var EmailToTypeDA = require('../UserService/EmailToTypeDA');
router.get('/search', function (req, res) {

    var subject = req.query.subject;
    search.searchBySubject(subject,function (err,tutors) {
        res.send(tutors);

    });

});


router.get('/findBalance',function (req,res) {

    console.log(req.query);

    EmailToTypeDA.getUserType(req.query.user_id,function (err,EmailType) {
        var userType = EmailType.userType;
        var UserDA =  require('../UserService/UserDA')(userType);
        UserDA.getUserByEmail(req.query.user_id,function (err,user) {

            if(err)
                console.log(err);
            else {
                var data ={};
                data.balance = user.balance;
                console.log(data);
                res.send(data);


            }

        });


    });
});


subjects = {
    availablesubjects: ['C++', 'Java', 'Algebra','Geometry']

}

router.get('/getavailablesubjects', function (req, res) {
    res.send(subjects);
});



module.exports = router;