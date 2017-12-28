var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    jwt = require('jsonwebtoken');

var itemsController = require('../controllers/itemsController'),
    usersController = require('../controllers/usersController'),
    authController = require('../controllers/authController');

// items actions
router.get('/items', itemsController.getItems);
router.get('/base64', itemsController.getBase64);
router.post('/upload', itemsController.upload);

// users actions
router.post('/user', usersController.createUser);

// auth actions
router.post('/authenticate', authController.authenticate);

function checkToken(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log('REQUEST TOKEN : ' + token);
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
}

module.exports = router;