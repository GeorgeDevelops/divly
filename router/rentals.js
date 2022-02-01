
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');

// Rental module

const { Rental } = require('../models/rental.js');

// Extra modules

const { Movie } = require('../models/movie');
const { Costumer } = require('../models/costumer');

Fawn.init('mongodb://localhost/divly');

router.post('/divly/new/rental', auth, async (req, res) => {

    const { error } = await req.body;
    if (error) return res.status(400).send({ ERROR: "400 | Invalid..." });

    const costumer = await Costumer.findById(req.body.costumerId);
    if (!costumer || costumer == '') return res.status(400).send({ ERROR: "404 | Costumer not found..." });

    const movie = await Movie.findById(req.body.movieId);
    if (!movie || movie == '') return res.status(400).send({ ERROR: "404 | Movie not found..." });

    let rental = new Rental({
        costumer: {
            _id: costumer._id,
            name: costumer.name,
            phone: costumer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {

        Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { NumberInStock: -1 }
            })
            .run();

        return res.status(200).send({
            message: "SUCCESS",
            rental
        });
    }
    catch (ex) {
        console.log(ex);
    }
});

router.get('/divly/rentals', async (req, res) => {
    const rentals = await Rental.find()

    if (!rentals || rentals == '') return res.status(404).send({ ERROR: "NO RENTALS FOUND" });

    return res.status(200).send({
        message: "SUCCCES",
        rentals
    });
})

module.exports = router;