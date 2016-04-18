/**
 * Created by tamim on 2/18/16.
 */

/** This DataAccess file is used to get the type of the user given email **/
/** As a bonus we can also check if a user is in database **/
var EmailToType = require('../../UserService/EmailToTypeModel');

exports.getUserType = function (email, callback) {

    // emailToUser is a document like {email:foo@gmail.com , userType:"student"}
    EmailToType.findOne({email: email}, function (err, emailToUser) {
        if (err)
            return callback(err);
        else
            return callback(null, emailToUser);


    });
};
exports.setUserType = function (email, type, callback) {

    var emailToType = new EmailToType({email: email, userType: type});
    emailToType.save(function (err) {

        if (err) {
            console.log("Failed to save email to type of the user " + email + " May be the email already exists");
            callback(err);
        }
        else
            callback(null);

    });
};