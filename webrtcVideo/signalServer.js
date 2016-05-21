/**
 * Created by tamim on 5/21/16.
 */
var config = require('getconfig');
var express = require('express')
var sockets = require('signalmaster/sockets')

var app = express()
var server = app.listen(8000);
sockets(server, config) // config is the same that server.js uses