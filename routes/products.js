let express = require('express');
let Product = require('../models/product');
let Order = require('../models/order');
let router = express.Router();

// entities
router.post('/add', (req, res) => {
    let product = new Product(req.body.product);
    Product.create(product, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed create a product'})
        } else {
            res.json({success: true, msg: 'Product was created', product: product})
        }
    });
});
router.post('/remove', (req, res) => {
    Product.removeById(req.body.product, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to remove a product'})
        } else {
            res.json({success: true, msg: 'Product was removed', product: product})
        }
    });
});

// getters
router.post('/getById', (req, res) => {
    Product.getById(req.body.id, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to find a product'})
        } else {
            res.json({success: true, msg: 'Product was found', product: product})
        }
    })
});
router.post('/getAllByCategory', (req, res) => {
    Product.getAllByCategory(req.body.category, (err, products) => {
        if (err) {
            res.json({success: false, msg: 'Failed to find a product by category'})
        } else {
            res.json({success: true, msg: 'Product by category was found', products: products})
        }
    })
});
router.post('/getAllByCompany', (req, res) => {
    Product.getAllByCompany(req.body.company, (err, products) => {
        if (err) {
            res.json({success: false, msg: 'Failed to find a product by company'})
        } else {
            res.json({success: true, msg: 'Product by company was found', products: products})
        }
    })
});
router.get('/getAll', (req, res) => {
    Product.getAll((err, products) => {
        if (err) {
            res.json({success: false, msg: 'Failed to find products'})
        } else {
            res.json({success: true, msg: 'Products were found', products: products})
        }
    });
});

// common changers
router.post('/changeSpecification', (req, res) => {
    Product.changeSpecification(req.body.product, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to change a specification'})
        } else {
            res.json({success: true, msg: 'Specification was changed', product: product})
        }
    })
});
router.post('/changePrice', (req, res) => {
    Product.changePrice(req.body.product, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to change product price'})
        } else {
            res.json({success: true, msg: 'Product price was changed', product: product})
        }
    })
});
router.post('/changeImage', (req, res) => {
    Product.changeImg(req.body.product, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to change product image'})
        } else {
            res.json({success: true, msg: 'Product image was changed', product: product})
        }
    })
});
router.post('/changeQuantity', (req, res) => {
    Product.changeQuantity(req.body.product, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to change product quantity'})
        } else {
            res.json({success: true, msg: 'Product quantity was changed', product: product})
        }
    })
});

// items
router.post('/addItems', (req, res) => {
    Product.addItems(req.body.data, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to add items'})
        } else {
            res.json({success: true, msg: 'Items was added', product: product})
        }
    })
});
router.post('/sellItems', (req, res) => {
    Product.sellItems(req.body.data, (err, product) => {
        if (err) {
            res.json({success: false, msg: 'Failed to sell items'})
        } else {
            res.json({success: true, msg: 'Items was sold', product: product})
        }
    })
});

// order
router.post('/createOrder', (req, res) => {
    const order = new Order(req.body.order);
    Order.addOrder(order, (err, order) => {
        if (err) {
            res.json({success: false, msg: 'Failed to add order'})
        } else {
            res.json({success: true, msg: 'Order was added', order: order})
        }
    })
});

module.exports = router;