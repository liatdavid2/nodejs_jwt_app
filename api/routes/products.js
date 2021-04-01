const express = require('express')
const jwt = require('jsonwebtoken')
const store = require('store')
const fs = require('fs');
const product = require('../models/product');
const router = express.Router();

//key-val Hash Object - find by id in o(1)
const products = {
    1: new product(1,'product1',47.5),
    2: new product(2,'product2',77.5)
}
//url: http://localhost:7000/api/v1.0/products
//headers: Content-Type:application/json
//         authorization : login token
//output: products list
//description:get products hash object if headers 
//            has authorization : login token
router.get('/', ensureToken, async (req, res, next) => {
    try {
        //ensureToken make sure the token is valid
        res.status(200).json(products)
    }
    catch (err) {
        next(err);
    }
});
//description:middleware that returns rout value if the token is valid
//output: call to rout value or forbidden status
function ensureToken(req, res, next) {
    try {
        const bearerHeader = req.headers["authorization"];
        console.log(bearerHeader)
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[0]
            req.token = bearerToken
            var privateKey = fs.readFileSync('c://private.key');
            // verify a token symmetric - synchronous
            var decoded = jwt.verify(req.token, privateKey);
            console.log(decoded)
            next();
        }
        else {
            res.sendStatus(403)
        }
    }
    catch (err) {
        next(err);
    }
}
//url: http://localhost:7000/api/v1.0/products
//headers: Content-Type:application/json
//         authorization : login token
//body example: {"id":4, "name": "product4","price": 17.5 }
//output: created! string or error Product id already exists!
//description: insert new product
router.post('/', ensureToken, async(req, res, next) => {
    try {
        //Product id already exists - 
        //do not accidentally delete product data
        if (products[req.body.id] !== undefined)
            res.status(403).json("Product id already exists!")
            
        let Product = new product(req.body.id,req.body.name,req.body.price)
        products[req.body.id] = Product
        res.status(201).json("created!")
    }
    catch (err) {
        next(err);
    }
});
//url: http://localhost:7000/api/v1.0/products/1
//headers: Content-Type:application/json
//         authorization : login token
//body example: {"name": "product4","price": 17.5 }
//output: errors or updated!
//description: update exist product
router.put('/:id', ensureToken, async(req, res, next) => {
    try {
        const { id } = req.params;
        //Product id already exists - don't accidentally delete product data
        if (products[id] === undefined)
            res.status(403).json("Product id do not exists in Products!")
        
        let Product = new product(id,req.body.name,req.body.price)    
        products[id] = Product
        res.status(200).json(products)
    }
    catch (err) {
        next(err);
    }
});


module.exports = router;