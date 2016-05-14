/**
 * Created by tamim on 4/16/16.
 *
 */






'use-strict';

var ChatDA = require('./ChatDA');


exports.handleClient =  function (io,socket) {

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
            senderName: data.senderName

        };


        io.to(data.to).emit('message', message); // Send the message to the reciever

        ChatDA.saveMessage(message);


    });

    socket.on('create', function (data) {

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

    socket.on('liveSessionOffer', function (data) {

        io.to(data.to).emit('liveSessionOffer', data);


    });
    socket.on('liveSessionReply',function(data){

        io.to(data.to).emit('liveSessionReply',data);

    });


    socket.on('disconnect', function (data) {


    });




}


