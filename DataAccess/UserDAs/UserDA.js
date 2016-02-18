/**
 * Created by tamim on 2/18/16.
 */

"use strict";


module.exports = function (userType) {
    var module = {};

    module.User = require('../DAFactory')(userType);


    module.save = function (userGiven, callback) {


        var user = new module.User(userGiven);
        user.save(function (err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    };

    /** This function finds a user By email id **/

    module.getUserByEmail = function (email, callback) {

        module.User.findOne({email: email}, function (err, foundUser) {
            if (err)
                return callback(err, null); //If some kind of error happens

            return callback(null, foundUser); // Else call the callback with the found user

        });
    };


    // Other stuff...
    module.getUserByResetLink = function (resetLink, callback) {
        module.User.findOne({
            resetPasswordToken: resetLink,
            resetPasswordExpires: {$gt: Date.now()}
        }, function (err, foundUser) {
            if (err)
                return callback(err, null);     //If some kind of error happens

            return callback(null, foundUser);  // Else call the callback with the found user


        });

    }


    return module;
};