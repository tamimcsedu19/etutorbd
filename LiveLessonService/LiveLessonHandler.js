/**
 * Created by tamim on 4/2/16.
 */


var http = require('http');
var app = require('../app');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var redis = require('redis');
var sub = redis.createClient();
var pub = redis.createClient();

sub.subscribe('chat');


io.on('connection', function (err, socket, session) {
    socket.on('chat', function (data) {
        pub.publish('chat', data);
    });

    socket.on('join', function (data) {
        pub.publish('chat', {msg: 'user joined'});
    });

    /*
     Use Redis' 'sub' (subscriber) client to listen to any message from Redis to server.
     When a message arrives, send it back to browser using socket.io
     */
    sub.on('message', function (channel, message) {
        socket.emit(channel, message);
    });
});
