var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(__dirname);
    res.sendFile('index.html', {root: __dirname});
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    res.send('Post page');
});


router.get('/search', function (req, res, next) {
    res.render('index', {title: 'Express'});

});

module.exports = router;
