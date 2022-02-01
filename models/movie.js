
const mongoose = require('mongoose');
// const { Genre } = require('./genre.js');
const { SchemaGenre } = require('./genre.js');

const movieSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255
    },
    genre: {
        type: SchemaGenre,
        required: true
    },
    NumberInStock: {
        type: Number,
        required: true,
        min: 0
    },
    MovieRentals: {
        type: Number,
        required: true,
        min: 0
    }
});

const Movie = mongoose.model('movie', movieSchema);

module.exports.Movie = Movie;

