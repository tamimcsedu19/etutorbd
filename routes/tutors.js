'use strict';
var express = require('express');
var router = express.Router();
var tutorSignUp = require('../BLL/TutorSignUp.js');
var passport = require('../BLL/LoginController');
var async = require('async');
var forgotreset = require('../BLL/PassReset');

/* GET signup page. */

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err)
        if (!user) {
            return res.redirect('login')
        }
        req.logIn(user, function (err) {

            if (err) {
                console.log(err);
                return next(err)
            }
            ;
            console.log('Redirecting user ' + user + 'to /');
            return res.redirect('home');
        });
    })(req, res, next);
});


router.get('/home', function (req, res) {

    if (req.user)
        res.send("You are logged in");
    else
        res.redirect('login');
});

router.get('/', function (req, res, next) {
    if (req.user)
        res.redirect('home');
    else
        res.redirect('login');


});
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/tutors/login');
});


router.post('/signup', function (req, res, next) {
    console.log(req.body);
    tutorSignUp.signUpTutor(req.body, function (err) {

        if (err) {
            console.log(err);

            res.send('Error');
        }
        else
            res.send('Success');
    });
});


router.get('/login', function (req, res) {
    if (req.user)
        res.redirect('home');
    res.render('login', {
        user: req.user
    });
});

router.get('/signup', function (req, res) {
    res.render('signup', {
        user: req.user
    });
});


router.get('/forgot', function (req, res) {
    res.render('forgot', {
        user: req.user
    });
});


router.post('/forgot', function (req, res, next) {

    forgotreset.sendForgot(req, res, next);

});

router.get('/reset/:token', function (req, res) {

    forgotreset.resetClicked(req, res);
});

router.post('/reset/:token', function (req, res) {

    forgotreset.passwordUpdate(req, res);
});

module.exports = router;
