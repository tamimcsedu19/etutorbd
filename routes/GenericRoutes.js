/**
 * Created by tamim on 5/9/16.
 */
'use-strict'
var express = require('express');
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

module.exports = router;