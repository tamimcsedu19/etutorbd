/**
 * Created by tamim on 4/30/16.
 */


var passport = require('./PassportConfig');
var jwt = require('jsonwebtoken');
var redis = require("redis"),
    redisClient = redis.createClient();
redisClient.on("error", function (err) {
    console.log("Error " + err);
});


var appendSessionAttrib = "liveLessonId";
exports.login = function(req, res) {

    passport.authenticate('local', function(err, user, info){
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found then
        if(user){
            var expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);
            var key = user.email + appendSessionAttrib;
            redisClient.get(key,function (liveLessonId) {

                token = jwt.sign({
                    _id: user._id,
                    liveLessonId:liveLessonId,
                    email: user.email,
                    fullName: user.fullName,
                    userType: user.userType,
                    exp: parseInt(expiry.getTime() / 1000),
                }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
            });
            /** TODO:: Change my secret to environment variable **/


            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};

module.exports.profileRead = function(req, res) {

    // If no user ID exists in the JWT return a 401
    if (!req.payload.email) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        UserDA = require('../UserService/UserDA')(req.payload.userType);
        // Otherwise continue
        UserDA.getUserByEmail(req.payload.email,function(err,user){
                res.status(200).json(user);
            });
    }

};
