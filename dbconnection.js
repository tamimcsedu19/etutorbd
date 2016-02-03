/**
 * Created by tamim on 1/27/16.
 */
/** A singleton containing the database connection **/

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

