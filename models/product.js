const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

let ProductScheme = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    company: {
        type: String,
        required: true
    },
    specification: [{
        name: String,
        value: String
    }]
}, {collection: 'products'});

let ProductDB = module.exports = mongoose.model('Product', ProductScheme);

// entities
module.exports.create = (product, callback) => {
    product.save(callback);
};
module.exports.removeById = (product, callback) => {
    let query = {_id: ObjectId(product._id)};
    ProductDB.find(query).remove(callback);
};

// getters
module.exports.getById = (id, callback) => {
    let query = {_id: ObjectId(id)};
    ProductDB.findOne(query, callback);
};
module.exports.getAllByCategory = (category, callback) => {
    ProductDB.find({category: category, quantity: {$gt: 0}}, callback);
};
module.exports.getAllByCompany = (company, callback) => {
    ProductDB.find({company: company}).where('quantity').gt(0).sort('category').exec(callback);
};
module.exports.getAll = (callback) => {
    ProductDB.find({}, callback);
};

// common changers
module.exports.changeSpecification = (product, callback) => {
    let query = {_id: ObjectId(product._id)};
    ProductDB.findOneAndUpdate(query, {specification: product.specification}, {new: true}, callback);
};
module.exports.changePrice = (product, callback) => {
    let query = {_id: ObjectId(product._id)};
    ProductDB.findOneAndUpdate(query, {price: product.price}, {new: true}, callback);
};
module.exports.changeImg = (product, callback) => {
    let query = {_id: ObjectId(product._id)};
    ProductDB.findOneAndUpdate(query, {image: product.image}, {new: true}, callback);
};
module.exports.changeQuantity = (product, callback) => {
    let query = {_id: ObjectId(product._id)};
    ProductDB.findOneAndUpdate(query, {quantity: product.quantity}, {new: true}, callback);
};


// items
module.exports.addItems = (data, callback) => {
    let query = {_id: ObjectId(data._id)};
    ProductDB.findOneAndUpdate(query, {$inc: {quantity: data.count}}, {new: true}, callback);
};
module.exports.sellItems = (data, callback) => {
    let query = {_id: ObjectId(data._id)};
    ProductDB.findOne(query, (err, res) => {
        if (err) throw err;
        let newQuantity = res.quantity - data.count;
        if (newQuantity < 0) {
            ProductDB.findOneAndUpdate(query, {quantity: 0}, {new: true}, callback);
        } else {
            ProductDB.findOneAndUpdate(query, {quantity: newQuantity}, {new: true}, callback);
        }
    });
};