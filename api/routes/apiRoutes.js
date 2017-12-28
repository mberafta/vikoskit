var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');

var itemsController = require('../controllers/itemsController');

router.get('/items', itemsController.getItems);
router.get('/base64', itemsController.getBase64);
router.post('/upload', itemsController.upload);

router.get('/auth/facebook', function (req, res) {
    console.log("Auth FB called ! ");
    passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    })
});

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

// route for logging out
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;