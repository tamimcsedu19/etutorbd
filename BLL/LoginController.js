/**
 * Created by tamim on 2/10/16.
 */
'use strict';
var passport = require('passport');
var TutorDA = require('./../DataAccess/TutorDA');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, {email: user.email, type: user.userType});
});

passport.deserializeUser(function (savedUser, done) {

    if (savedUser.type == "tutor") {
        var tutor = TutorDA.getTutor(savedUser.email);
        if (tutor)
            done(null, tutor);
        else
            done("Error", null);
    }

});


passport.use(new LocalStrategy(function (username, password, done) {

    var tutor = TutorDA.getTutor(email);
    if (tutor) {
        tutor.comparePassword(password, function (err, isMatch) {
            if (isMatch) {
                return done(null, tutor);
            } else {
                return done(null, false, {message: 'Incorrect password.'});
            }

        });


    } else {

        return done(null, false, {message: 'Incorrect username.'});
    }

}));
module.exports = passport;


