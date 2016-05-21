/**
 * Created by tamim on 4/16/16.
 */
'use-strict'

var mongoose = require("../DataAccess/DbConnection");



module.exports = function (chatType) {
    var module = {};

    module.chatModelFactory = function (chatType){

        /**
         *  Two types of message , one inside live lesson , and other normal
         *  takes an input and return the database of appropriate type
         */
        if(chatType == "normal")
            return mongoose.model('MessageNormal',require('./MessageModel'));
        else
            return mongoose.model('MessageLive',require('./MessageModel'));

    }

    module.Message = module.chatModelFactory(chatType);


    module.saveMessage = function (n_message) {



        var message = new module.Message(n_message);

        message.save(function (err) {
            if (err)
                console.log(err);
            else
                console.log(message + " \n" + "saved successfully");

        });
    }
    module.retrieveMessages = function (param, callback) {

        /**
         * param: to_user_id,from_user_id,offset,pageSize
         */

        module.Message.find({
            "$or": [{
                "to": param.toUserId,
                "from": param.fromUserId,
                "_id": {"$lt": param.offset}
            },
                {
                    "to": param.fromUserId,
                    "from": param.toUserId,
                    "_id": {"$lt": param.offset}
                }
            ]
        }).limit(param.pageSize).sort({_id: 1}).exec(callback);


    }
    return module;
}