
const request = require('supertest');
const Server = require('../../index');
const { Genre } = require('../../models/genre');

describe('Auth middleware test', () => {

    beforeEach(() => {
        Server;
    });

    let token;

    const exec = () => {
        return request(require('../../index'))
            .post('/divly/new/genre')
            .set('x-authentication-token', token)
            .send({ genre: 'horror' })
    }

    afterEach(async () => {
        await Genre.remove({});
        await Server.close();
    });

    it('should return 401 if no token is provided.', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401)
    });

    it('should return 400 if token is not valid', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

});