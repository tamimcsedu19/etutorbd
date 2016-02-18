/**
 * Created by tamim on 2/3/16.
 */

/**
 * This will handle all thing after a Tutor Sign's up , i.e creating profile
 Create appropriate mappings etc
 **/
'use strict';

var subjectToTutorDA = require('./../DataAccess/SubjectToTutorDA');
var TutorDA = require('./../DataAccess/UserDAs/TutorDA');
module.exports = {


    signUpTutor: function (tutorGiven, callback) {

        var email = tutorGiven.email;
        TutorDA.getTutor(email, function (err, tutor) {
            if (tutor) {
                callback("User Already exists", null);
            }
            else {


                for (i in tutorGiven.subjects) {

                    console.log("Saving " + tutorGiven.expertises[i]);

                    subjectToTutorDA.save({
                        subject: tutorGiven.subjects[i],
                        tutorEmail: tutorGiven.email
                    }, function (err) {
                        if (err)
                            console.log("Unable to Tutor to given expertise" + expertises[i]);

                        return callback(err, null);
                    });


                }

                delete tutorGiven.subjects;
                tutorGiven.userType = "tutor";

                return TutorDA.save(tutorGiven, callback);
            }


        });

    }


}
