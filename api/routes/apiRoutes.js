var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    passport = require('passport');

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

module.exports = router;