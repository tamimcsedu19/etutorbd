/**
 * Created by tamim on 4/30/16.
 */
'use strict'
var authController = require('./AuthController');
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});


router.post('/login', function (req, res) {

    console.log("trying to log in user");
    authController.login(req,res);

});

router.get('/profile', auth, authController.profileRead);

module.exports = router;