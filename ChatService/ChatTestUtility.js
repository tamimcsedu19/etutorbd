/**
 * Created by tamim on 4/16/16.
 */
'use strict'
var ChatDA = require('./ChatDA')('normal');

var Message = ChatDA.chatModelFactory('normal');

exports.insertMessages = function () {
    Message.remove({}, function (err) {


        var messages = []

        messages.push({

            to: 'tamim.tamim1382@gmail.com',
            from: 'rakib13th@yahoo.com',
            message: 'hi',
            timeStamp: 0,
            sampleName: 'Rakib A.'
        });

        messages.push({

            to: 'rakib13th@yahoo.com',
            from: 'tamim.tamim1382@gmail.com',
            message: 'hello',
            timeStamp: 1,
            sampleName: 'Tamim A.'
        });


        messages.push({

            to: 'mahfujhowlader@gmail.com',
            from: 'tamim.tamim1382@gmail.com',
            message: 'hello',
            timeStamp: 2,
            sampleName: 'Tamim A.'
        });


        for (var i in messages) {
            ChatDA.saveMessage((messages[i]));
        }
        console.log("All messages saved");
    });

}