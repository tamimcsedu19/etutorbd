/**
 * Created by tamim on 2/3/16.
 */
/** This will handle all thing after a Student Sign's up , i.e creating profile
 Create appropriate mappings etc

 **/

'use strict';

var StudentDA = require('./../UserService/UserDA')('student');
var EmailToTypeDA = require('./../UserService/EmailToTypeDA');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');




module.exports = {


    signUpStudent: function (studentGiven, callback) {
        var student = {};


        student.userType = 'student';
        student.fullName = studentGiven.fullName;
        student.email = studentGiven.email;
        student.salt = crypto.randomBytes(16).toString('hex');
        student.hash = crypto.pbkdf2Sync(studentGiven.password,student.salt,1000, 64).toString('hex');


        EmailToTypeDA.setUserType(student.email, 'student', function (err) {

            if (err) {
                err.customData = "USER ALREADY EXISTS";
                return callback(err);
            }

            StudentDA.save(student, function (err) {
                if (err) {
                    console.log("Error Signing up though the email does not exists");
                    callback(err);

                } else {

                    var expiry = new Date();
                    expiry.setDate(expiry.getDate() + 7);
                    var token = jwt.sign({
                        _id: student._id,
                        email: student.email,
                        fullName: student.fullName,
                        userType: student.userType,
                        exp: parseInt(expiry.getTime() / 1000),
                    }, "MY_SECRET");

                    callback(null,token);
                }

            });


            /**
             * TODO
             * Code for sending the Activation email **/


        });


    }
}
