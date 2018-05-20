let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

let Company = require('../models/company');

const encryptor = require('../config/encryption');
const config = require('../config/database');


// entities
router.post('/register', (req, res) => {
    let company = new Company(req.body.company);
    Company.getByTitle(company.title, (err, data) => {
        if (err) throw err;
        if (!data) {
            Company.add(company, (err, company) => {
                if (err) {
                    res.json({success: false, msg: 'Failed register a company'})
                } else {
                    res.json({success: true, msg: 'Company was registered', company: company})
                }
            });
        } else {
            res.json({success: false, msg: 'Company is already exists'})
        }
    });

});
router.post('/authenticate', (req, res) => {
    Company.authenticate(req.body.company, (err, company) => {
        if (err) throw err;
        if (!company) {
            return res.json({success: false, msg: 'Company not found'})
        }
        encryptor.comparePassword(req.body.company.key, company.key, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: company}, config.secret, {expiresIn: 604800});
                res.json({
                    success: true,
                    msg: 'Company was verified',
                    token: 'JWT ' + token,
                    company: company
                });
            } else {
                return res.json({success: false, msg: 'Wrong key'});
            }
        });

    });
});
router.post('/remove', (req, res) => {
    Company.removeByTitle(req.body.title, (err, company) => {
        if (err) {
            res.json({success: false, msg: 'Failed to remove a company'})
        } else {
            res.json({success: true, msg: 'Company was removed', company: company})
        }
    });
});

// getters
router.post('/getByTitle', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Company.getByTitle(req.body.company, (err, company) => {
            if (err) {
                res.json({success: false, msg: 'Failed to find a company'})
            } else {
                res.json({success: true, msg: 'Company was found', company: company})
            }
        })
    }
});
router.get('/getAll', (req, res) => {
    Company.getAll((err, companies) => {
        if (err) {
            res.json({success: false, msg: 'Failed to find companies'})
        } else {
            res.json({success: true, msg: 'Companies were found', companies: companies})
        }
    });
});

// common changers
router.post('/changeRequirements', (req, res) => {
    Company.changeRequirements(req.body.company, (err, company) => {
        if (err) {
            res.json({success: false, msg: 'Failed to change requirements'})
        } else {
            res.json({success: true, msg: 'Requirements were changed', company: company})
        }
    })
});
router.post('/changePhone', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Company.changePhone(req.body.company, (err, company) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change company phone'})
            } else {
                res.json({success: true, msg: 'Company phone was changed', company: company})
            }
        })
    }
});
router.post('/changeEmail', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Company.changeEmail(req.body.company, (err, company) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change email'})
            } else {
                res.json({success: true, msg: 'Email was changed', company: company})
            }
        })
    }
});
router.post('/changeProfileImg', (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.json({success: false, msg: 'No token provided'})
    } else {
        Company.changeImg(req.body.company, (err, company) => {
            if (err) {
                res.json({success: false, msg: 'Failed to change profile img'})
            } else {
                res.json({success: true, msg: 'Profile img was changed', company: company})
            }
        })
    }
});

// consultant
router.post('/hireConsultant', (req, res) => {
    Company.hireConsultant(req.body.data, (err, company) => {
        if (err) {
            res.json({success: false, msg: 'Failed to hire a consultant'})
        } else {
            res.json({success: true, msg: 'Consultant was hired', company: company})
        }
    })
});
router.post('/dismissConsultant', (req, res) => {
    Company.dismissConsultant(req.body.data, (err, company) => {
        if (err) {
            res.json({success: false, msg: 'Failed to dismiss a consultant'})
        } else {
            res.json({success: true, msg: 'Consultant was dismissed', company: company})
        }
    })
});

// product
router.post('/addProduct', (req, res) => {
    Company.addProduct(req.body.data, (err, company) => {
        if (err) {
            res.json({success: false, msg: 'Failed to add a product'})
        } else {
            res.json({success: true, msg: 'Product was added', company: company})
        }
    })
});
router.post('/removeProduct', (req, res) => {
    Company.removeProduct(req.body.data, (err, company) => {
        if (err) {
            res.json({success: false, msg: 'Failed to remove a product'})
        } else {
            res.json({success: true, msg: 'Product was added', company: company})
        }
    })
});

// work request
router.post('/addRequest', (req, res) => {
    Company.addRequest(req.body.data, (err, company) => {
        if (err) {
            res.json({success: false, msg: 'Failed to add a request'});
        } else {
            res.json({success: true, msg: 'Request was added', company: company})
        }
    })
});
router.post('/deleteRequest', (req, res) => {
    Company.deleteRequest(req.body.data, (err, company) => {
        if (err) {
            res.json({success: false, msg: 'Failed to delete a request'})
        } else {
            res.json({success: true, msg: 'Request was deleted', company: company})
        }
    })
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