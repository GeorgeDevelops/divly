
const errorCatcher = require('../middleware/async');
const emitterEvent = require('events');
const emitter = new emitterEvent();
const express = require('express');
const admin = require('../middleware/admin.js');
const auth = require('../middleware/auth.js');
const router = express.Router();

const { Genre } = require('../models/genre.js');

// List of Genres 

router.get('/divly/genres', errorCatcher(async (req, res) => {

    const genres = await Genre.find()
    if (!genres || genres == '') return res.status(404).send("No genres found!")

    emitter.emit('genres', { genres });
    return res.status(200).send(genres);
}));

// get Single Genre

router.get('/divly/genres/:id', errorCatcher(async (req, res) => {

    const found = await Genre.find().sort();
    if (!found || found == '') return res.status(404).send("The genre ID given was not found!!!");

    return res.status(200).send(found);
}));

// publish a genre

router.post('/divly/new/genre', [auth, admin], async (req, res) => {

    if (!req.body.genre || req.body.genre == '') return res.status(400).send("Genre is required.") 

    const genre = await new Genre({
        genre: req.body.genre
    });

    if (genre.genre.length < 5) return res.status(400).send("Genre must be at least 5 characters long.");
    if (genre.genre.length > 15) return res.status(400).send("Genre is too long.");

    genre.save();
    return res.status(200).send("Genre saved.")
});

// Get and Update

router.put('/divly/update/genres/:id', [auth, admin], async (req, res) => {
    if (!req.body.genre || req.body.genre == '') return res.status(400).send('ERROR! Genre name is required.');
    const response = await Genre.findById({_id: req.params.id});

    if (!response || response == '') return res.status(404).send("Genre not found!");

    response.genre = req.body.genre
    response.save();
    return res.status(200).send(response.genre);
});

// delete genre

router.delete('/divly/delete/genres/:id', [auth, admin], errorCatcher(async (req, res) => {

    const response = await Genre.findById({_id: req.params.id});
    if (!response || response == '') return res.status(404).send("Genre not found!");
    response.remove();
    return res.status(200).send("Genre deleted.")
}));

module.exports = router;

