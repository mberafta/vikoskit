var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    jwt = require('jsonwebtoken');

var itemsController = require('../controllers/itemsController'),
    usersController = require('../controllers/usersController'),
    authController = require('../controllers/authController');

// Router middleware
router.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log('REQUEST TOKEN : ' + token);
    if (token && token != '') {
        // verifies secret and checks exp
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                console.log(err);
                req.tokenError = err;
            } else {
                // if everything is good, save to request for use in other routes
                console.log(decoded);
                req.tokenSuccess = decoded;
            }
        });
    } else {
        req.tokenError = "Il n'y a aucun token pour le moment.";
    }
    console.log(req.tokenError || req.tokenSuccess);
    next();
});

// items actions
router.get('/items', itemsController.getItems);
router.get('/base64', itemsController.getBase64);
router.post('/upload', itemsController.upload);
router.get('/xls', itemsController.xlsToJson);

// users actions
router.post('/user', usersController.createUser);

// auth actions
router.post('/authenticate', authController.authenticate);



module.exports = router;