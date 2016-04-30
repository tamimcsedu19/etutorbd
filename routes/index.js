'use strict';
var express = require('express');
var router = express.Router();
var studentSignUp = require('./StudentSignUp.js');
var passport = require('./PassportConfig');
var async = require('async');
var forgotReset = require('./PassReset');

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

            console.log('Redirecting user ' + user + 'to /');
            return res.redirect('home');
        });
    })(req, res, next);

});


router.get('/home', function (req, res) {

    if (req.user)
        res.render('layout', {
            user: req.user
        });
    else
        res.redirect('login');
});

router.get('/', function (req, res, next) {


    res.send('index.html');
    if (req.user)
        res.redirect('home');
    else
        res.redirect('login');


});


router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('login');
});


router.post('/signup', function (req, res, next) {

    studentSignUp.signUpStudent(req.body, function (err) {

        if (err) {
            console.log(err);
            res.send(err.customData);
        }
        else
            res.redirect('home');
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
    if (req.user)
        res.redirect('home');
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

    forgotReset.sendForgot(req, res, next);

});

router.get('/reset/:token', function (req, res) {

    forgotReset.resetClicked(req, res);
});

router.post('/reset/:token', function (req, res) {

    forgotReset.passwordUpdate(req, res);
});




module.exports = router;
