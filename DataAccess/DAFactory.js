/**
 * Created by tamim on 2/18/16.
 */
var Student = require('./../models/Student');

module.exports = function (userType) {

    if (userType == "tutor")
        return require('./../models/Tutor');
    else if (userType == "student")
        return require('./../models/Student');
    ;

}