/**
 * Created by tamim on 4/16/16.
 */
'use strict';
var sio = require("socket.io");
var io = sio.listen(3001);

var ChatDA = require('./ChatDA');


io.on('connection', function (socket) {

    console.log('A user has connected to the socket');


    socket.on('message', function (data) {

        /** TODO :: Implement token authorization with redis
         *  data.token
         *  data.from
         * **/

        var message = {
            to: data.to,
            from: data.from,
            message: data.message,
            timeStamp: data.timeStamp,
            sampleName: data.sampleName

        };


        io.to(data.to).emit('message', message); // Send the message to the reciever

        ChatDA.saveMessage(message);


    });

    socket.on('create', function (data) {

        /** TODO :: Implement token authorization with redis
         *  data.token
         *  data.from
         * **/
        console.log('Room creating with user_id: ' + data.user_id);
        socket.join(data.user_id); // Id of the user  possibly email


    });


    socket.on('retrieveMessages', function (data) {

        ChatDA.retrieveMessages(data, function (error, docs) {
            socket.emit('historyMessages', {
                id: data,
                messages: docs

            });
        });

    });


    socket.on('disconnect', function (data) {


    });


});


