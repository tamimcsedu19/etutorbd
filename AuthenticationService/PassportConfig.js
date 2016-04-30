/**
 * Created by tamim on 2/10/16.
 */
'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var EmailToTypeDA = require('../DataAccess/UserDAs/EmailToTypeDA');
var UserDA;
var async = require('async');
var crypto = require('crypto');

/** An authentication strategy for passport **/


passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'


    },

    function (email, password, done) {
        // wdone stands for waterfall done
        async.waterfall([
                /** This function finds the user type and in process checks if the user already exists in the system **/

                    function getUserType(wdone) {
                    EmailToTypeDA.getUserType(email, function (err, emailToType) {
                        /** IF it finds a email to type matching call the next function with the type argument **/
                        if (!emailToType) {
                            if (!err)
                                var err = {};
                            err.message = "NO USER WITH THIS EMAIL";
                            return wdone(err);
                        }

                        else {
                            return wdone(err, emailToType.userType);
                        }

                    });

                },
                /** This function acceses the approprate DA and retrives the password **/
                    function getUser(userType, wdone) {
                        UserDA = require('../UserService/UserDA')(userType); // Access the appropriate schema
                        UserDA.getUserByEmail(email, function (err, user) {
                        if (err)
                             err.message = "INCOSISTENTDATA";
                        wdone(err, user);

                    });

                },
                /** This function matches the password with Users comparePassword , see models/SchemaFunctions */
                    function matchPassword(user, wdone) {

                        var hash = crypto.pbkdf2Sync(password,user.salt, 1000, 64).toString('hex');

                        if (hash == user.hash){
                            console.log("Successfull Authentication");


                            /** TODO:: Return a user with only the property that is required i.e delete user.hash,user.salt etc**/

                            console.log('successfull login');
                            done(null, user);
                            wdone(null, 'done')

                        }
                        else {

                            var err = {};
                            err.message = "WRONG PASSWORD";
                            wdone(err, 'done');
                        }


                }]
            ,
            function (err) {
                /** We got an error we call the unsuccessfull callback **/
                if (err) {
                    console.log(err.message);
                    return done(null, false, {message: err.message});
                }
            }
        );

}));
module.exports = passport;


