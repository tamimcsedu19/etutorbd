/**
 * Created by tamim on 2/12/16.
 */

var mongoose = require('mongoose');

if (mongoose.connection.readyState == 0) {
    if (process.env.NODE_ENV == 'test')
        mongoose.connect('mongodb://localhost/test');
    else
        mongoose.connect('mongodb://localhost/nottest');
}
module.exports = mongoose;