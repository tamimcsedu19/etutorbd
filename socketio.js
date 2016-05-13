/**
 * Created by tamim on 5/13/16.
 */

'use-strict'

// SocketIO singleton

var sio = require("socket.io");
var io = sio.listen(3001);
var chatController =       require('./ChatService/ChatController');
var liveLessonController = require('./LiveLessonService/LiveLessonController');

io.on('connection',function(socket){

    chatController.handleClient(io,socket);
    liveLessonController.handleClient(io,socket);

});
module.exports = io;
