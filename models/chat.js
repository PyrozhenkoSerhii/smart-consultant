let mongoose = require('mongoose');

let ChatScheme = mongoose.Schema({
    user: {
        type: String,
    },
    message: {
        type: String,
    },
    profileImg: {
        type: String
    },
    room: {
        type: String
    },
    date: {
        type: Date
    },
    type: {
        type: String
    },
    isSystemMessage: {
        type: Boolean
    }

}, {collection: 'chat'});

let Chat = module.exports = mongoose.model('Chat', ChatScheme);

// forum
module.exports.addForumMessage = function (chat, callback) {
      chat.save(callback);
};
module.exports.getAllForumMessages = function(callback){
    Chat.find({type: 'forum'}, callback);
};

//private chat
module.exports.addPrivateMessage = function (chat, callback) {
    chat.save(callback);
};
module.exports.getAllPrivateByUser = function (username, callback) {
    Chat.find({user: username, type: 'private'}, callback);
};
module.exports.getAllByRoom = function (room, callback) {
    Chat.find({room: room, type: 'private'}, callback);
};

module.exports.getAllByRoomAndTime = function (room, time, callback) {
    Chat.find({room: room, date: {$gte: time}}, callback);
};