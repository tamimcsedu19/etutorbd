/**
 * Created by tamim on 2/10/16.
 */
'use strict';
var passport = require('passport');
var TutorDA = require('./../DataAccess/TutorDA');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {

    console.log('Serializing user' + user);
    done(null, {email: user.email, type: user.userType});
});

passport.deserializeUser(function (savedUser, done) {

    if (savedUser.type == "tutor") {

        TutorDA.getTutor(savedUser.email, done);

    }

});


passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'


    },

    function (email, password, done) {


        var tutor = TutorDA.getTutor(email, function (err, tutor) {

            if (tutor) {


                tutor.comparePassword(password, function (err, isMatch) {
                    if (isMatch) {
                        console.log('Successfully logged in');
                        return done(null, tutor);
                    } else {
                        console.log("Incorrect password");
                        return done(null, false, {message: 'Incorrect password.'});
                    }
                });


            } else {
                console.log("Incorrect email");

                return done(null, false, {message: 'Incorrect email'});
            }


        });




}));
module.exports = passport;


