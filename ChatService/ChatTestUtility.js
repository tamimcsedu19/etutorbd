/**
 * Created by tamim on 4/16/16.
 */
var Message = require('./MessageModel');
exports.insertMessages = function () {
    Message.remove({}, function (err) {


        messages = []

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
            new Message(messages[i]).save();
        }
        console.log("All messages saved");
    });

}