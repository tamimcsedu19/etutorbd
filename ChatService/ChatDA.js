/**
 * Created by tamim on 4/16/16.
 */
'use-strict'
var Message = require('./MessageModel');
exports.saveMessage = function (n_message) {

    var message = new Message(n_message);
    message.save();


}

exports.retrieveMessages = function (param, callback) {

    /**
     * param: to_user_id,from_user_id,offset,pageSize
     */
    Message.find({
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
    }).limit(param.pageSize).sort({_id: -1}).exec(callback);


}