
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 200
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1000,
        trim: true,
        unique: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.genToken = function () {
    const Token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return Token;
}

const User = mongoose.model('user', userSchema);

module.exports.User = User;