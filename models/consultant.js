const mongoose = require('mongoose');
const encryptor = require('../config/encryption');

let ConsultantScheme = mongoose.Schema({
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
    phone: {
        type: String,
        required: true
    },
    languages: {
        type: String,
        required: true
    },
    rate: {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    available: {
        type: Boolean,
        required: true
    },
    availableTime: {
        type: String,
        required: true
    },
    certificate: {
        type: String,
        required: true
    },
    workingConditions: {
        type: Object,
    },
    card: {
        type: String
    },
    company: {
        type: String,
    },
    correspondence: [{
        user: String,
        message: String,
        roomNum: String,
        date: {type: Date, default: Date.now}
    }],
    disposals: [{
        product: String,
        customer: String,
        date: {type: Date, default: Date.now}
    }],
}, {collection: 'consultants'});

let ConsultantDB = module.exports = mongoose.model('Consultant', ConsultantScheme);

// entities
module.exports.add = (consultant, callback) => {
    encryptor.encryptPassword(consultant.password, (err, hash) => {
        consultant.password = hash;
        consultant.save(callback);

    });
};
module.exports.authenticate = (consultant, callback) => {
    ConsultantDB.findOne({username: consultant.username}, callback);
};

// getters
module.exports.getByUsername = (consultant, callback) => {
    ConsultantDB.findOne({username: consultant}, callback);
};
module.exports.getAll = (callback) => {
    ConsultantDB.find({}, callback);
};

//common changes
module.exports.changePhone = (consultant, callback) => {
    ConsultantDB.findOneAndUpdate({username: consultant.username}, {phone: consultant.phone}, {new: true}, callback);
};
module.exports.changeImg = (consultant, callback) => {
    ConsultantDB.findOneAndUpdate({username: consultant.username}, {profileImg: consultant.profileImg}, {new: true}, callback);
};
module.exports.changeCard = (consultant, callback) => {
    ConsultantDB.findOneAndUpdate({username: consultant.username}, {card: consultant.card}, {new: true}, callback);
};
module.exports.changeAge = (consultant, callback) => {
    ConsultantDB.findOneAndUpdate({username: consultant.username}, {age: consultant.age}, {new: true}, callback);
};
module.exports.changeEmail = (consultant, callback) => {
    ConsultantDB.findOneAndUpdate({username: consultant.username}, {email: consultant.email}, {new: true}, callback);
};
module.exports.changeCategory = (consultant, callback) => {
    ConsultantDB.findOneAndUpdate({username: consultant.username}, {category: consultant.category}, {new: true}, callback);
};
module.exports.changeCertificate = (consultant, callback) => {
    ConsultantDB.findOneAndUpdate({username: consultant.username}, {certificate: consultant.certificate}, {new: true}, callback);
};

//rate
module.exports.changeRate = (consultant, callback) => {
    ConsultantDB.findOneAndUpdate({username: consultant.username}, {rate: consultant.rate}, {new: true}, callback);
};

//availability data
module.exports.getAllAvailable = (callback) => {
    ConsultantDB.find({available: true}, callback);
};
module.exports.getAvailableByCategory = (category, callback) => {
    ConsultantDB.find({available: true, category: category}, callback);
};
module.exports.changeAvailability = (consultant, callback) => {
    ConsultantDB.findOneAndUpdate({username: consultant.username},
        {available: consultant.available, availableTime: consultant.availableTime}, callback);
};

// chat data
module.exports.saveChat = (data, callback) => {
    let query = {user: data.user, message: data.message, date: Date.now()};
    ConsultantDB.findOneAndUpdate({username: data.username},
        {$push: {'correspondence': query}}, {new: true}, callback);
};

//disposals data
module.exports.updateDisposals = (data, callback) => {
    let query = {product: data.product, customer: data.customer, date: Date.now()};
    ConsultantDB.findOneAndUpdate({username: data.consultant},
        {$push: {'disposals': query}}, {new: true}, callback);
};

//company data
module.exports.addCompany = (data, callback) => {
    ConsultantDB.findOneAndUpdate({username: data.username}, {company: data.company}, {new: true}, callback);
};
module.exports.removeCompany = (username, callback) => {
    ConsultantDB.findOneAndUpdate({username: username}, {company: null}, {new: true}, (err, res) => {
        if (err) throw err;
    });
};
