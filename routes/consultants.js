let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const Consultant = require('../models/consultant');
const Customer = require('../models/customer');

const encryptor = require('../config/encryption');
const config = require('../config/database');

// entities
router.post('/register', (req, res) => {
    let consultant = new Consultant(req.body.consultant);
    Customer.getByUsername(consultant.username, (err, cusData) => {
        if (err) throw err;
        if (!cusData) {
            Consultant.getByUsername(consultant.username, (err, data) => {
                if (err) throw err;
                if (!data) {
                    Consultant.add(consultant, (err, consultant) => {
                        if (err) {
                            console.log(err);
                            res.json({success: false, msg: 'Failed to register a consultant'})
                        } else {
                            res.json({success: true, msg: 'Consultant was created', consultant: consultant})
                        }
                    });
                } else {
                    res.json({success: false, msg: 'Username is already exists'})
                }
            });
        }
        else {
            res.json({success: false, msg: 'Username is already exists'})
        }
    });
});
router.post('/authenticate', (req, res) => {
    Consultant.authenticate(req.body.consultant, (err, consultant) => {
        if (err) throw err;
        if (!consultant) {
            return res.json({success: false, msg: 'Consultant not found'});
        }
        encryptor.comparePassword(req.body.consultant.password, consultant.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: consultant}, config.secret, {expiresIn: 604800});
                res.json({
                    success: true,
                    msg: 'Consultant was verified',
                    token: 'JWT ' + token,
                    consultant: consultant
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
        Consultant.getByUsername(req.body.consultant, (err, consultant) => {
            if (err) {
                res.json({success: false, msg: 'Failed to find a consultant'})
            } else {
                res.json({success: true, msg: 'Consultant was found', consultant: consultant})
            }
        })
    }
});
router.get('/getAll', (req, res) => {
    Consultant.getAll((err, consultants) => {
        if (err) {
            res.json({success: false, msg: 'Failed to fetch consultants'})
        } else {
            res.json({success: true, msg: 'Consultants were fetched', consultants: consultants})
        }
    });
});

// common changers
router.post('/changePhone', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Consultant.changePhone(req.body.consultant, (err, consultant) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change a phone'})
            } else {
                res.json({success: true, msg: 'Phone was changed', consultant: consultant})
            }
        });
    }
});
router.post('/changeEmail', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Consultant.changeEmail(req.body.consultant, (err, consultant) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change an email'})
            } else {
                res.json({success: true, msg: 'Email was changed', consultant: consultant})
            }
        });
    }
});
router.post('/changeProfileImg', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Consultant.changeImg(req.body.consultant, (err, consultant) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change profile img'})
            } else {
                res.json({success: true, msg: 'Profile image was changed', consultant: consultant})
            }
        });
    }
});
router.post('/changeCard', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Consultant.changeCard(req.body.consultant, (err, consultant) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change a card'})
            } else {
                res.json({success: true, msg: 'Card was changed', consultant: consultant})
            }
        });
    }
});
router.post('/changeAge', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Consultant.changeAge(req.body.consultant, (err, consultant) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change an age'})
            } else {
                res.json({success: true, msg: 'Age was changed', consultant: consultant})
            }
        });
    }
});
router.post('/changeCategory', (req, res) => {
    Consultant.changeCategory(req.body.consultant, (err, consultant) => {
        if (err) {
            res.json({success: false, msg: 'Failed to change a category'})
        } else {
            res.json({success: true, msg: 'Category was changed', consultant: consultant})
        }
    });
});
router.post('/changeCertificate', (req, res) => {
    Consultant.changeCertificate(req.body.consultant, (err, consultant) => {
        if (err) {
            res.json({success: false, msg: 'Failed to change a certificate'})
        } else {
            res.json({success: true, msg: 'Certificate was changed', consultant: consultant})
        }
    });
});

// rate
router.post('/changeRate', (req, res) => {
    Consultant.changeRate(req.body.consultant, (err, consultant) => {
        if (err) {
            res.json({success: false, msg: 'Failed to change a rate'})
        } else {
            res.json({success: true, msg: 'Rate was changed', consultant: consultant})
        }
    });
});
router.post('/getRate', (req,res)=>{
    Consultant.getByUsername(req.body.username, (err, consultant) => {
        if (err) {
            res.json({success: false, msg: 'Failed to find a consultant'})
        } else {
            res.json({success: true, msg: 'Consultant was found', rate: consultant.rate})
        }
    })
});

// availability
router.post('/changeAvailability', (req, res) => {
    Consultant.changeAvailability(req.body.consultant, (err, consultant) => {
        if (err) {
            res.json({success: false, msg: 'Failed to change an availability'})
        } else {
            res.json({success: true, msg: 'Availability was changed', consultant: consultant})
        }
    });
});
router.post('/getAllAvailable', (req, res) => {
    Consultant.getAllAvailable((err, consultant) => {
        if (err) {
            res.json({success: false, msg: 'Failed to fetch available consultants'})
        } else {
            res.json({success: true, msg: 'Available consultants were fetched', consultant: consultant})
        }
    });
});
router.post('/getAvailableByCategory', (req, res) => {
    Consultant.getAvailableByCategory(req.body.category, (err, consultants) => {
        if (err) {
            res.json({success: false, msg: 'Failed to fetch available consultants by category'})
        } else {
            res.json({success: true, msg: 'Available consultants by category were fetched', consultants: consultants})
        }
    });
});

// chat
router.post('/saveChat', (req, res) => {
    Consultant.saveChat(req.body.data, (err, chat) => {
        if (err) {
            res.json({success: false, msg: 'Failed to save a conversation'})
        } else {
            res.json({success: true, msg: 'Conversation was saved', chat: chat})
        }
    });
});

// disposals
router.post('/updateDisposals', (req, res) => {
    Consultant.updateDisposals(req.body.data, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to update the disposals'})
        } else {
            res.json({success: true, msg: 'Disposals were updated', product: product})
        }
    });
});

// company
router.post('/addCompany', (req, res) => {
    Consultant.addCompany(req.body.data, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to add a company'})
        } else {
            res.json({success: true, msg: 'Company was added', product: product})
        }
    });
});
router.post('/removeCompany', (req, res) => {
    Consultant.removeCompany(req.body.consultant, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to remove a company'})
        } else {
            res.json({success: true, msg: 'Company was removed', product: product})
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