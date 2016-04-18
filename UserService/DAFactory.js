/**
 * Created by tamim on 2/18/16.
 */
var Student = require('./StudentModel');

module.exports = function (userType) {

    if (userType == "tutor")
        return require('./TutorModel');
    else if (userType == "student")
        return require('./StudentModel');
    ;

}