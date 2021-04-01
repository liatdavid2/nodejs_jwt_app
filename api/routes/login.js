const express = require('express');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const router = express.Router();

// http://localhost:7000/api/v1.0/login
// description: get token for privilage user(admin)
// headers: Content-Type:application/json
// body example: { userName: 'gogo', mail: 'gogo@gmail.com' }
//       need to check in DB if user is privilage user(admin)
//       and have right to read from protected routs
// output: token
router.post('/', (req, res, next) => {
    try {
        let user = req.body;
        // Sign with default (HMAC SHA256)
        let privateKey = fs.readFileSync('c://private.key');
        // auth user
        let token = jwt.sign({ userName: 'gogo', mail: 'gogo@gmail.com' },
            privateKey, { expiresIn: '1h', algorithm: 'HS256' });

        // verify a token symmetric - synchronous
        let decoded = jwt.verify(token, privateKey);
        res.json({
            authorization: token
        });
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;