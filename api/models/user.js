// app/models/user.js
// load the things we need
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

// define the schema for our user model
var userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJWT = function () {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.JWT_SECRETS);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);