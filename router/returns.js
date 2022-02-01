
const express = require('express');
const moment = require('moment');
const router = express.Router();
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');

router.post('/divly/returns', auth, async (req, res)=>{
    if(!req.body.costumerId) return res.status(400).send("No costumerId provided.");
    if(!req.body.movieId) return res.status(400).send("No movieId provided.");

    const rental = await Rental.lookup(req.body.costumerId, req.body.movieId);

    if (!rental || rental == '') return res.status(404).send("No related rentals found!");

    if (rental.dateReturned) return res.status(400).send("Movie already returned.")

    rental.dateReturned = new Date();
    rental.rentalFee = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate
    rental.save();

    const movie = await Movie.findById(req.body.movieId)
    movie.NumberInStock = movie.NumberInStock + 1;
    movie.MovieRentals = movie.MovieRentals - 1;
    movie.save();

    res.status(200).send("Returned successfully!")
});

module.exports = router;