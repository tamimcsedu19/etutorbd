/**
 * Created by tamim on 2/14/16.
 */
'use strict';
var async = require('async');
var crypto = require('crypto');
var EmailToTypeDA = require('./../DataAccess/UserDAs/EmailToTypeDA');
var UserDA;
var nodemailer = require('nodemailer');

module.exports =
{
    sendForgot: function (req, res, next) {
        // Set the appropriate UserDA

        async.waterfall([

            function findUserType(done) {

                EmailToTypeDA.getUserType(req.body.email, function (err, emailToType) {
                    if (!err && emailToType)
                        UserDA = require('./../UserService/UserDA')(emailToType.userType);
                    else {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('forgot');

                    }
                    done();

                });

            },

            function generateResetToken(done) {



                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },


            function (token, done) {

                UserDA.getUserByEmail(req.body.email, function (err, user) {

                    if (err) {
                        console.log(err);
                        return done(err);
                    }

                    tutor.resetPasswordToken = token;
                    tutor.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    tutor.save(function (err) {
                        done(err, token, tutor);
                    });
                });
            },

            function (token, tutor, done) {
                var transporter = nodemailer.createTransport('smtps://wikimailer90%40gmail.com:wikimailer@smtp.gmail.com');

                var mailOptions = {
                    to: tutor.email,
                    from: 'passwordreset@demo.com',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/tutors/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                transporter.sendMail(mailOptions, function (err) {
                    req.flash('info', 'An e-mail has been sent to ' + tutor.email + ' with further instructions.');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('forgot');
        });
    },
    resetClicked: function (req, res) {
        UserDA.getUserByResetLink(req.params.token, function (err, tutor) {
            if (!tutor) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('forgot');
            }
            res.render('reset', {
                user: req.user
            });
        });


    },
    passwordUpdate: function (req, res) {
        async.waterfall([
            function (done) {
                UserDA.getUserByResetLink(req.params.token, function (err, tutor) {
                    if (!tutor) {
                        console.log("Updating  the password failed");
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('forgot');
                    }

                    tutor.password = req.body.password;
                    tutor.resetPasswordToken = undefined;
                    tutor.resetPasswordExpires = undefined;

                    tutor.save(function (err) {
                        if (err)
                            done(err);
                        else
                            done(err, tutor);
                    });
                });
            },
            function (tutor, done) {
                var transporter = nodemailer.createTransport('smtps://wikimailer90%40gmail.com:wikimailer@smtp.gmail.com');
                var mailOptions = {
                    to: tutor.email,
                    from: 'passwordreset@demo.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + tutor.email + ' has just been changed.\n'
                };
                transporter.sendMail(mailOptions, function (err) {
                    req.flash('success', 'Success! Your password has been changed.');
                    if (err)
                        done(err);
                    else
                        res.redirect('home');
                });

            }
        ], function (err) {

            res.redirect('login');
        });

    }
}
