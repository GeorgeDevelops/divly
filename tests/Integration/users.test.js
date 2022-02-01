
const request = require('supertest');
const { User } = require('../../models/user');

describe('USERS', ()=>{
    let server;
    let user;

    beforeEach(async ()=>{ 
        server = require('../../index');
        user = new User({
            name: '123',
            email: 'admin@admin.com',
            password: '12345678'
        });
        await user.save();
    });
    afterEach(async ()=>{ 
        server.close();
        await User.remove({})
    });

    it('should return 400 if req.body is not valid', async ()=>{
        const json = { 
            name: '',
            email: '',
            password: ''
        }

        const res = await request(server)
        .post('/divly/new/user')
        .send(json)


        expect(res.status).toBe(400);
    });
    it('should return 400 if req.body.name is not valid', async ()=>{
        const json = { 
            name: '',
            email: '12345',
            password: '12345678'
        }

        const res = await request(server)
        .post('/divly/new/user')
        .send(json)


        expect(res.status).toBe(400);
    });
    it('should return 400 if req.body.email is not valid', async ()=>{
        const json = { 
            name: '123',
            email: '',
            password: '12345678'
        }

        const res = await request(server)
        .post('/divly/new/user')
        .send(json)


        expect(res.status).toBe(400);
    });
    it('should return 400 if req.body.password is not at least 8 characters long', async ()=>{
        const json = { 
            name: '123',
            email: '12345',
            password: '1'
        }

        const res = await request(server)
        .post('/divly/new/user')
        .send(json)


        expect(res.status).toBe(400);
    });
    it('should return 400 if req.body is not valid', async ()=>{
        const json = { 
            name: '123',
            email: '12345',
            password: ''
        }

        const res = await request(server)
        .post('/divly/new/user')
        .send(json)


        expect(res.status).toBe(400);
    });
    it('should return 400 if email already exist.', async ()=>{
        const json = { 
            name: '123',
            email: 'admin@admin.com',
            password: '12345678'
        }

        const res = await request(server)
        .post('/divly/new/user')
        .send(json)


        expect(res.status).toBe(400);
    });
    it('should return 200 if request is valid', async ()=>{
        const json = { 
            name: '12345',
            email: '12345',
            password: '12345678'
        }

        const res = await request(server)
        .post('/divly/new/user')
        .send(json)


        expect(res.status).toBe(200);
    });
});