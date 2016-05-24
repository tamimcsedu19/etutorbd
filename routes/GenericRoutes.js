/**
 * Created by tamim on 5/9/16.
 */
'use strict'
var express = require('express');
var search = require('../SearchService/Search');
var router = express.Router();
router.get('/login',function(req,res){

    res.sendFile(global.__base+'/public/index.html', function (err) {
        console.log(err);
    });
});
router.get('/register',function(req,res){

    res.sendFile(global.__base+'/public/index.html', function (err) {
        console.log(err);
    });
});

router.get('/tutor-home',function(req,res){

    res.sendFile(global.__base+'/public/index.html', function (err) {
        console.log(err);
    });
});

router.get('/profile',function(req,res){

    res.sendFile(global.__base+'/public/index.html', function (err) {
        console.log(err);
    });
});




router.get('/tutors/:subject', function (req, res) {

    var subject = req.params.subject;
    search.searchBySubject(subject,function (err,tutors) {
        res.send(tutors);

    });

});
module.exports = router;