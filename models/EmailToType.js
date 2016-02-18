/**
 * Created by tamim on 2/18/16.
 */

"use strict";
var mongoose = require("../DataAccess/DbConnection");
var Schema = mongoose.Schema;
/**
 *  This Schema maps a useremail to particular user type(tutor/student)
 */

var emailToTypeSchema = new Schema({

    email: {type: String, required: true, maxlength: 40, unique: true},
    userType: {type: String, required: true, maxlength: 10}

});

var emailToTypeSchema = mongoose.model('EmailToType', emailToTypeSchema);
module.exports = emailToTypeSchema;