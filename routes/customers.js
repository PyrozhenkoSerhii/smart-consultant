const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const Customer = require('../models/customer');
const Consultant = require('../models/consultant');

const encryptor = require('../config/encryption');
const config = require('../config/database');

// entities
router.post('/register', (req, res) => {
    let customer = new Customer(req.body.customer);
    Customer.getByUsername(customer.username, (err, data) => {
        if (err) throw err;
        if (!data) {
            Consultant.getByUsername(customer.username, (err, cusData) => {
                if (err) throw err;
                if (!cusData) {
                    Customer.register(customer, (err, customer) => {
                        if (err) {
                            res.json({success: false, msg: 'Failed to register a customer'})
                        } else {
                            res.json({success: true, msg: 'Customer created', customer: customer})
                        }
                    });
                } else {
                    res.json({success: false, msg: 'Username is already exists'})
                }
            });

        } else {
            res.json({success: false, msg: 'Username is already exists'})
        }
    });

});
router.post('/authenticate', (req, res) => {
    Customer.authenticate(req.body.customer, (err, customer) => {
        if (err) throw err;
        if (!customer) {
            return res.json({success: false, msg: 'Customer not found'});
        }
        encryptor.comparePassword(req.body.customer.password, customer.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: customer}, config.secret, {expiresIn: 604800});
                res.json({
                    success: true,
                    msg: 'Customer was verified',
                    token: 'JWT ' + token,
                    customer: customer
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

// getters
router.post('/getByUsername', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Customer.getByUsername(req.body.customer, (err, customer) => {
            if (err) {
                res.json({success: false, msg: 'Failed to find a customer'})
            } else {
                res.json({success: true, msg: 'Customer was found', customer: customer})
            }
        })
    }
});
router.post('/getByUsernameMobile', (req, res) => {
    Customer.getByUsername(req.body.username, (err, customer) => {
        if (err) {
            res.json({success: false, msg: 'Failed to find a customer'})
        } else {
            res.json({success: true, msg: 'Customer was found', customer: customer})
        }
    })
});
router.get('/getAll', (req, res) => {
    Customer.getAll((err, customers) => {
        if (err) {
            res.json({success: false, msg: 'Failed to fetch customers'})
        } else {
            res.json({success: true, msg: 'Customers were fetched', customers: customers})
        }
    });
});

// common changers
router.post('/changeProfileImg', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Customer.changeImg(req.body.customer, (err, customer) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change profile img'})
            } else {
                res.json({success: true, msg: 'Profile image was changed', customer: customer})
            }
        });
    }

});
router.post('/changeEmail', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Customer.changeEmail(req.body.customer, (err, customer) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change an email'})
            } else {
                res.json({success: true, msg: 'Email was changed', customer: customer})
            }
        });
    }

});
router.post('/changeAge', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Customer.changeAge(req.body.customer, (err, customer) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change an age'})
            } else {
                res.json({success: true, msg: 'Age was changed', customer: customer})
            }
        });
    }
});

// purchases
router.post('/updatePurchases', (req, res) => {
    Customer.updatePurchases(req.body.data, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to update the purchases'})
        } else {
            res.json({success: true, msg: 'Purchases were updated', product: product})
        }
    });
});

// chat
router.post('/saveChat', (req, res) => {
    Customer.saveChat(req.body.data, (err, chat) => {
        if (err) {
            res.json({success: false, msg: 'Failed to save a conversation'})
        } else {
            res.json({success: true, msg: 'Conversation was saved', chat: chat})
        }
    });
});

function checkToken(token) {
    if (token === undefined) {
        return false;
    } else {
        let secret = new Buffer('secretJWT', 'base64');
        token = token.replace(/^JWT\s/, '');
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) return false;
        });
        return true;
    }
}


module.exports = router;