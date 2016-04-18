/**
 * Created by tamim on 2/3/16.
 */
/** This will handle all thing after a Student Sign's up , i.e creating profile
 Create appropriate mappings etc

 **/

'use strict';

var StudentDA = require('./../UserService/UserDA')('student');
var EmailToTypeDA = require('./../DataAccess/UserDAs/EmailToTypeDA');

module.exports = {


    signUpStudent: function (studentGiven, callback) {

        studentGiven.userType = 'student';
        EmailToTypeDA.setUserType(studentGiven.email, 'student', function (err) {

            if (err) {
                err.customData = "EMAIL ALREADY EXISTS";
                return callback(err);
            }

            StudentDA.save(studentGiven, function (err) {
                if (err) {
                    console.log("Error Signing up though the email does not exists");
                    callback(err);

                } else
                    callback(null);
            });


            /** Code for sending the Activation email **/


        });


    }
}
