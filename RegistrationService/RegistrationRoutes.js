/**
 * Created by tamim on 4/30/16.
 */

var studentSignUp = require('./StudentSignUp');
var express = require('express');
var router = express.Router();

router.post('/register', function (req, res) {

    studentSignUp.signUpStudent(req.body, function (err,token) {

        if (err) {
            console.log(err);
            res.json({message:err.customData,err:true});
        }
        else {

            var resBody = {

                message: "Registration Successful",
                err: false,
                token : token
            }


            res.status(200);

            res.json(resBody);


        }
    });
});


module.exports = router;