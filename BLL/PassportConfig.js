/**
 * Created by tamim on 2/10/16.
 */
'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var EmailToTypeDA = require('../DataAccess/UserDAs/EmailToTypeDA');
var User;
var async = require('async');


passport.serializeUser(function (user, done) {

    console.log('Serializing user' + user);
    done(null, {email: user.email, type: user.userType});
});

passport.deserializeUser(function (savedUser, done) {

    var UserDA = require('./../UserDAs/UserDA')(savedUser.type);
    UserDA.getUserByEmail(savedUser.email, function (err, user) {
        if (err)
            return done(err);
        else
            return done(null, user);
    });
});

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
                        if (err) {
                            err.customData = "NOUSER";
                        }
                        return wdone(err, emailToType.userType);

                    });

                },
                /** This function acceses the approprate DA and retrives the password **/
                    function getUser(userType, wdone) {
                    User = require('../DataAccess/UserDAs/UserDA')(userType); // Access the appropriate schema
                    UserDA.getUserByEmail(email, function (err, user) {
                        if (err)
                            err.customData = "INCOSISTENTDATA";
                        wdone(err, user);

                    });

                },
                /** This function matches the password with Users comparePassword , see models/SchemaFunctions */
                    function matchPassword(user, wdone) {
                    user.comparePassword(password, function (err, isMatch) {
                        if (err) {
                            err.customData = "WRONGPASSWORD";
                            return wdone(err, wdone);
                    }
                        else {
                            /** We have successfully matched our So authentication was successfull **/
                            done(null, user);
                            wdone(null, 'done');
                        }
                });
                }]
            ,
            function (err) {
                /** We got an error we call the unsuccessfull callback **/
                return done(null, false, {customData: "INCORRECT INFO"});
            }
        );

}));
module.exports = passport;


