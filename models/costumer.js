const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    phone: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 12
    },
    isGold: {
        type: Boolean,
        required: true
    }
});

const Costumer = mongoose.model('costumer', schema);

module.exports.Costumer = Costumer;