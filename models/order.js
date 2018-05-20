let mongoose = require('mongoose');

let OrderScheme = mongoose.Schema({
    product: {
        type: Object,
    },
    customer: {
        type: Object,
    },
    consultant: {
        type: Object
    },
    country: {
        type: String
    },
    town: {
        type: String
    },
    address: {
        type: String
    },
    phone:{
        type: String
    },
    transportation: {
        type: Object
    },
    date: {
        type: Date
    }

}, {collection: 'orders'});

let Order = module.exports = mongoose.model('Order', OrderScheme);

module.exports.addOrder = (order, callback) => {
    order.save(callback);
};