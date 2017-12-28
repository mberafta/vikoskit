var express = require('express');
var router = express.Router();
var apiRoutes = require('../api/routes/apiRoutes');

module.exports = function (app) {
    app.use('/api', apiRoutes);
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function (req, res) {
        console.log("Connection ok");
    });



};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}