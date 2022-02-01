
const express = require('express');
const router = express.Router();

// Movie Module

const { Movie } = require('../models/movie.js');
const { Genre } = require('../models/genre.js');


// List of Movies 
router.get('/divly/movies', async (req, res) => {

    const costumer = await Movie.find()

    if (!costumer || costumer == '') return res.status(404).send({ ERROR: "NOT FOUND" });

    return res.status(200).send(costumer);
});

// get Single Movie

router.get('/divly/movie/:id', async (req, res) => {

    const found = await Movie.find({ _id: req.params.id }).sort();
    if (!found || found == '') return res.status(404).send("The costumer ID given was not found!!!");

    return res.status(200).send(found);
});

// publish a Movie

router.post('/divly/new/movie', async (req, res) => {

    // const { error } = validate(req.body);
    // if (error) res.status(400).send({ ERROR: "Something went wrong.." });

    const genre = await Genre.findById(req.body.genreId);
    if (!genre || genre == '') return res.status(404).send({ ERROR: "Invalid genre" });

    const movie = await new Movie({
        name: req.body.name,
        genre: {
            _id: genre._id,
            genre: genre.genre
        },
        NumberInStock: req.body.NumberInStock,
        MovieRentals: req.body.MovieRentals
    });

    if (!movie || movie == '') return res.status(404).send({ ERROR: "COULD NOT SAVE MOVIE..." });

    movie.save();

    return res.status(200).send({
        message: "Movie created successfully",
        new_movie: movie
    });
});

// Get and Update

router.put('/divly/update/movie/:id', (req, res) => {

    Movie.findByIdAndUpdate(req.params.id, {

        name: req.body.name,
        genre: Genre,
        NumberInStock: req.body.NumberInStock,
        MovieRentals: req.body.MovieRentals

    }, { new: true }, (err, docs) => {
        if (err) return res.status(404).send("The movie ID given was not found!!!");
        if (!docs || docs == '') res.status(500).send("Something went wrong...");

        res.status(200).send({
            message: "SUCCESS",
            updated: docs
        });
    });
});

// delete Movie

router.delete('/divly/delete/costumer/:id', (req, res) => {

    Movie.deleteOne({ _id: req.params.id }, (err, docs) => {
        if (err) return res.status(404).send("The movie ID given was not found!!!");
        if (!docs || docs == '') res.status(404).send("Something went wrong...");

        return res.status(200).send({
            status: "SUCCESS",
            deleted: docs
        });
    });
});

module.exports = router;