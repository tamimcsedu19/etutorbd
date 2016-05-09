/**
 * Created by tamim on 4/30/16.
 */

var searchRoutes = require('../SearchService/SearchRoutes');
var registrationRoutes = require('../RegistrationService/RegistrationRoutes');
var loginRoutes = require('../AuthenticationService/LoginRoutes');
var genericRoutes = require('./GenericRoutes');



exports.addRoutes = function (app){

    app.use('/',genericRoutes);
    app.use('/api',searchRoutes);
    app.use('/api',registrationRoutes);
    app.use('/api',loginRoutes);



}
