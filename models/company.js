let mongoose = require('mongoose');
let encryptor = require('../config/encryption');

let CompanyScheme = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    profileImg: {
        type: String
    },
    consultants: [{
        consultant: String,
        date: Date
    }],
    products: [{
        id: String,
        title: String
    }],
    requests: [{
        user: String,
        message: String
    }]
}, {collection: 'companies'});

let CompanyDB = module.exports = mongoose.model('Company', CompanyScheme);

// entities
module.exports.add = (company, callback) => {
    encryptor.encryptPassword(company.key, (err, hash) => {
        company.key = hash;
        company.save(callback);
    })
};
module.exports.authenticate = (company, callback) => {
    CompanyDB.findOne({title: company.title}, callback);
};
module.exports.removeByTitle = (title, callback) => {
    CompanyDB.find({title: title}).remove(callback);
};

// getters
module.exports.getByTitle = (title, callback) => {
    CompanyDB.findOne({title: title}, callback);
};
module.exports.getAll = (callback) => {
    CompanyDB.find({}, callback);
};


//common changers
module.exports.changeRequirements = (company, callback) => {
    CompanyDB.findOneAndUpdate({title: company.title}, {requirements: company.requirements}, {new: true}, callback);
};
module.exports.changePhone = (company, callback) => {
    CompanyDB.findOneAndUpdate({title: company.title}, {phone: company.phone}, {new: true}, callback);
};
module.exports.changeEmail = (company, callback) => {
    CompanyDB.findOneAndUpdate({title: company.title}, {email: company.email}, {new: true}, callback);
};
module.exports.changeImg = (company, callback) => {
    CompanyDB.findOneAndUpdate({title: company.title}, {profileImg: company.profileImg}, {new: true}, callback);
};

// consultants
module.exports.hireConsultant = (data, callback) => {
    CompanyDB.findOneAndUpdate({title: data.title}, {$push: {'consultants': data.request}}, {new: true}, callback);
};
module.exports.dismissConsultant = (data, callback) => {
    CompanyDB.findOneAndUpdate({title: data.title},
        {$pull: {'consultants': {consultant: data.consultant}}}, {new: true}, callback);
};

// products
module.exports.addProduct = (data, callback) => {
    const query = {id: data.product.id, title: data.product.title};
    CompanyDB.findOneAndUpdate({title: data.company}, {$push: {'products': query}}, {new: true}, callback);
};
module.exports.removeProduct = (data, callback) => {
    CompanyDB.findOneAndUpdate({title: data.company},
        {$pull: {'products': {product: data.product.id}}}, {new: true}, callback);
};

// work request
module.exports.addRequest = (data, callback) => {
    CompanyDB.findOneAndUpdate({title: data.title}, {$push: {'requests': data.request}}, callback);
};
module.exports.deleteRequest = (data, callback) => {
    CompanyDB.findOneAndUpdate({title: data.title}, {$pull: {'requests': {user: data.user}}}, callback);
};