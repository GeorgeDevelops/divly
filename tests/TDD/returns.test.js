
const request = require('supertest');
const moment = require('moment');
const { User } = require('../../models/user');
const { Rental } = require('../../models/rental');
const { Movie } = require('../../models/movie');
const { Genre } = require('../../models/genre');
const mongoose = require('mongoose');


describe('Returns TDD', ()=>{
    let server;
    let costumerId = mongoose.Types.ObjectId();
    let movieId = mongoose.Types.ObjectId();
    let genre;
    let rental;
    let movie;
    
    beforeEach(async ()=>{
        server = require('../../index');
        genre = new Genre({
            genre: "action"
        });

        movie = new Movie({
            _id: movieId,
            name: 'John wick',
            genre: genre,
            NumberInStock: 9,
            MovieRentals: 1
        });
        await movie.save();

        rental = new Rental({
            costumer: {
                _id: costumerId,
                name: '12345',
                isGold: true,
                phone: 12345678910
            }, 
            movie: {
                _id: movieId,
                title: 'Spider-Man',
                dailyRentalRate: 2 
            }
        });
        await rental.save();
    }); 

    afterEach(async ()=>{
        server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should work!', async ()=>{
        const res = await Rental.findById(rental._id);
        expect(res).not.toBeNull();
    });

    it('should return 401 if client is not logged in', async ()=>{
        const res = await request(server)
            .post('/divly/returns')
            .send({costumerId, movieId})

        expect(res.status).toBe(401) // No client logged in
    });

    it('must return 400 if costumerId id not provided', async () =>{
        const token = new User().genToken();
        const res = await request(server)
            .post('/divly/returns')
            .set('x-authentication-token', token)
            .send({ movieId })

        expect(res.status).toBe(400); // No costumerId provided;
    });

    it('must return 400 if movieId id not provided', async () =>{

        const token = new User().genToken();
        const res = await request(server)
            .post('/divly/returns')
            .set('x-authentication-token', token)
            .send({ costumerId })

        expect(res.status).toBe(400); // No movieId provided;
    });

    it('must return 404 if no rental is found with the given costumerId/movieId', async () =>{

        await Rental.remove({})

        const token = new User().genToken();
        const res = await request(server)
            .post('/divly/returns')
            .set('x-authentication-token', token)
            .send({ costumerId, movieId })

        expect(res.status).toBe(404); // No rental were found related to these two properties costumerId/movieId
    });

    it('must return 400 if is already returned', async () =>{

        rental.dateReturned = new Date();
        rental.save();

        const token = new User().genToken();
        const res = await request(server)
            .post('/divly/returns')
            .set('x-authentication-token', token)
            .send({ costumerId, movieId })

        expect(res.status).toBe(400); // Rental already returned.
    });

    it('must return 200 if request is valid', async () =>{

        const token = new User().genToken();
        const res = await request(server)
            .post('/divly/returns')
            .set('x-authentication-token', token)
            .send({ costumerId, movieId })

        expect(res.status).toBe(200); // return request succeeded.
    });

    it('must validate the return time', async () =>{

        const token = new User().genToken();
        const res = await request(server)
            .post('/divly/returns')
            .set('x-authentication-token', token)
            .send({ costumerId, movieId })

        const dbRental = await Rental.findById(rental._id);
        const diff = new Date - dbRental.dateReturned;
        console.log(diff)

        expect(diff).toBeLessThan(10 * 1000); // No rental were found related to these two properties costumerId/movieId
    });

    it('must calculate the rentalFee', async ()=>{

        rental.dateOut = moment().add(-7, 'days').toDate();
        rental.save();

        const token = new User().genToken();
        const res = await request(server)
            .post('/divly/returns')
            .set('x-authentication-token', token)
            .send({ costumerId, movieId })

        const dbRental = await Rental.findById(rental._id);

        expect(dbRental.rentalFee).toBe(14);
    });

    it('must Increase the movieStock', async ()=>{

        const token = new User().genToken();
        const res = await request(server)
            .post('/divly/returns')
            .set('x-authentication-token', token)
            .send({ costumerId, movieId })

        // const dbRental = await Rental.findById(rental._id);
        const movieStock = await Movie.findById(movieId);
        expect(movieStock.NumberInStock).toBe(10)
        expect(movieStock.MovieRentals).toBe(0)
    });

});