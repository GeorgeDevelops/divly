


const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({
    genre: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ["action", "adventure", "horror", "drama", "romance", "thriller", "Sci-Fi"]
    }
});

const Genre = mongoose.model('genre', genreSchema);

module.exports.Genre = Genre;
module.exports.SchemaGenre = genreSchema;