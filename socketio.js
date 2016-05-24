/**
 * Created by tamim on 5/13/16.
 */

'use strict'

// SocketIO singleton

var sio = require("socket.io");
var io = sio.listen(3001);
var chatController =       require('./ChatService/ChatController');
var liveLessonController = require('./LiveLessonService/LiveLessonController');
const EventEmitter = require('events');



const myEmitter = new EventEmitter();




io.on('connection',function(socket){

    chatController.handleClient(io,socket,myEmitter);
    liveLessonController.handleClient(io,socket,myEmitter);

});
module.exports = io;
