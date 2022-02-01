
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('Genres', () => {

    beforeEach(() => { 
        require('../../index');
    });

    afterEach(async () => {
        require('../../index').close();
        await Genre.remove({});
    });

    describe('GET /genres', () => {

        it('should return 404 if no genres are found', async () => {
            const res = await request(require('../../index')).get('/divly/genres');
            expect(res.status).toBe(404);
        })

        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ]);
            const res = await request(require('../../index')).get('/divly/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
        });

        it('should return genre with the input ID', async () => {
            const id = new mongoose.Types.ObjectId();
            await Genre.collection.insertOne({ _id: id, name: "genre1" })
            const res = await request(require('../../index')).get(`/divly/genres/${id}`);
            expect(res.body[0]._id).toBe(id.toString());
        });

        it('should return status 404 if input ID is not valid', async () => {
            const id = '19';
            const res = await request(require('../../index')).get(`/divly/genres/${id}`);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /genres', () => {
        let genre;
        let token;
        const user = { name: 'admin', isAdmin: true }
    

        const exec = async () => {
            return await request(require('../../index'))
                .post('/divly/new/genre')
                .set('x-authentication-token', token)
                .send(genre);
        }

        beforeEach(() => {
            token = new User(user).genToken();
        });

        it('should return 400 if !req.body.genre', async () => {
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return a 401 unauthorized status if client is not logged in', async () => {
            token = '';
            genre = { genre: "gen" }
            const res = await exec();
            expect(res.status).toBe(401);
            return;
        });

        it('should return a 400 status if genres length is not longer than 5 characters', async () => {
            genre = { genre: "gen" }
            const res = await exec();
            expect(res.status).toBe(400);
            return;
        });

        it('should return a 400 status if genres length is longer than 15 characters', async () => {
            genre = { genre: 'GGGGGGGGGGGGGGGG' }
            const res = await exec();
            expect(res.status).toBe(400);
            return;
        });

        it('should return a 200 status if genre was saved', async () => {
            genre = { genre: "action" };
            const res = await exec();
            const response = await Genre.find({ genre: "action" })
            expect(res.status).toBe(200);
            expect(response[0].genre).toMatch(/action/);
            return;
        });
    });

    describe('PUT /genres', () => {

        it('should return 400 if no genre is provided', async ()=>{
            const id =  mongoose.Types.ObjectId().toHexString();
            const user = { name: 'admin', isAdmin: true }
            const token = new User(user).genToken();

            const res = await request(require('../../index'))
                .put(`/divly/update/genres/${id}`)
                .set('x-authentication-token', token)
                .send({ genre: '' })

            expect(res.status).toBe(400)
        });

        it('should return 404 if no genre is found with given ID', async () => {

            const id =  mongoose.Types.ObjectId().toHexString();
            const user = { name: 'admin', isAdmin: true }
            const token = new User(user).genToken();

            const res = await request(require('../../index'))
                .put(`/divly/update/genres/${id}`)
                .set('x-authentication-token', token)
                .send({ genre: 'horror' })

            expect(res.status).toBe(404) // because passed ID doesn't exists
        });

        it('it should return 200 if genre was updated', async () => {

            const id = new mongoose.Types.ObjectId();
            await Genre.collection.insertOne({ _id: id, genre: 'action' });

            const user = { name: 'admin', isAdmin: true }
            const token = new User(user).genToken();
            const genre = { genre: "horror" }

            const res = await request(require('../../index'))
                .put(`/divly/update/genres/${id}`)
                .set('x-authentication-token', token)
                .send(genre)

            expect(res.status).toBe(200)
        });
    });

    describe('DELETE /genres', ( )=> {

        it('should return 404 if genre with given ID is not found', async () => {
            const id = new mongoose.Types.ObjectId();
            const user = { name: 'admin', isAdmin: true }
            const token = new User(user).genToken();

            const res = await request(require('../../index'))
                .delete(`/divly/delete/genres/${id}`)
                .set('x-authentication-token', token)

            expect(res.status).toBe(404)
        });

        it('should return 200 if genre is deleted.', async () => {

            const id = new mongoose.Types.ObjectId();
            await Genre.collection.insertOne({ _id: id, genre: 'action' });

            const user = { name: 'admin', isAdmin: true }
            const token = new User(user).genToken();

            const res = await request(require('../../index'))
                .delete(`/divly/delete/genres/${id}`)
                .set('x-authentication-token', token)

                expect(res.status).toBe(200)
        });
    });
});
