const mongoose = require('mongoose');
const encryptor = require('../config/encryption');

let CustomerScheme = mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
    },
    purchases: [{
        product: String,
        consultant: String,
        date: {type: Date, default: Date.now}
    }],
    correspondence: [{
        user: String,
        message: String,
        room: String,
        profileImg: String,
        date: {type: Date, default: Date.now}
    }],
}, {collection: 'customers'});

let CustomerDB = module.exports = mongoose.model('Customer', CustomerScheme);

// entities
module.exports.register = (customer, callback) => {
    encryptor.encryptPassword(customer.password, (err, hash) => {
        customer.password = hash;
        customer.save(callback);
    });
};
module.exports.authenticate = (customer, callback) => {
    CustomerDB.findOne({username: customer.username}, callback);
};

// getters
module.exports.getByUsername = (username, callback) => {
    CustomerDB.findOne({username: username}, callback);
};
module.exports.getAll = (callback) => {
    CustomerDB.find({}, callback);
};

//common changers
module.exports.changeImg = (customer, callback) => {
    CustomerDB.findOneAndUpdate({username: customer.username}, {profileImg: customer.profileImg}, {new: true}, callback);
};
module.exports.changeEmail = (customer, callback) => {
    CustomerDB.findOneAndUpdate({username: customer.username}, {email: customer.email}, {new: true}, callback);
};
module.exports.changeAge = (customer, callback) => {
    CustomerDB.findOneAndUpdate({username: customer.username}, {age: customer.age}, {new: true}, callback);
};

// purchases data
module.exports.updatePurchases = (data, callback) => {
    let query = {product: data.product, consultant: data.consultant, date: Date.now()};
    CustomerDB.findOneAndUpdate({username: data.customer},
        {$push: {'purchases': query}}, {new: true}, callback);
};

// chat data
module.exports.saveChat = (data, callback) => {
    let query = {user: data.user, message: data.message, date: Date.now()};
    CustomerDB.findOneAndUpdate({username: data.username},
        {$push: {'correspondence': query}}, {new: true}, callback);
};