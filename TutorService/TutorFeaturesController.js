/**
 * Created by tamim on 5/20/16.
 */

var TutorFeaturesDA = require('./TutorFeaturesDA');


exports.getSampleTutors = function (callback) {

    TutorFeaturesDA.getAllTutors(callback);
}