/**
 * Created by tamim on 2/12/16.
 */

var mongoose = require('mongoose');

if (mongoose.connection.readyState == 0) {
    mongoose.connect('mongodb://localhost/test');

}
module.exports = mongoose;