/**
 * Created by tamim on 5/20/16.
 */
var TutorModel = require('../UserService/TutorModel');



exports.getAllTutors = function (callback) {

    /** Simple get all the tutors function **/
    
    TutorModel.find({},function (err,data) {
       callback(err,data);

    });



}
