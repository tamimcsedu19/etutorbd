/**
 * Created by tamim on 4/30/16.
 */


var passport = require('./PassportConfig');
var StudentDA = require('../UserService/UserDA')('student');
var jwt = require('jsonwebtoken');
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

            token = jwt.sign({
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                userType: user.userType,
                exp: parseInt(expiry.getTime() / 1000),
            }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!

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
        // Otherwise continue
        StudentDA.getUserByEmail(req.payload.email,function(err,user){
                res.status(200).json(user);
            });
    }

};
