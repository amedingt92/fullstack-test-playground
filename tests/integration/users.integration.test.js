const request = require('supertest');
const app = require('../../src/app');
const knex = require('../../db/db');  // shared Knex instance


let server;

beforeAll(async () => {
    server = app.listen(4000);
    await knex.migrate.latest();
});

afterAll(async () => {
    await knex.destroy();
    await server.close();
});

describe('Users API Integration Tests', () => {
    beforeEach(async () => {
        await knex('users').truncate(); // Clear table before each test
    });

    it('GET /api/users - should return a list of users', async () => {
        await knex('users').insert({ name: 'Sample', email: 'sample@example.com' });
        const response = await request(server).get('/api/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /api/users - should create a new user with valid data', async () => {
        const newUser = { name: 'Unique User', email: 'uniqueuser@example.com' };
        const response = await request(server).post('/api/users').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newUser.name);
        expect(response.body.email).toBe(newUser.email);
    });

    it('POST /api/users - should fail with missing name or email', async () => {
        const response = await request(server).post('/api/users').send({ email: 'no_name@example.com' });
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/Name and email are required/);
    });

    it('GET /api/users/:id - should return a specific user', async () => {
        const [id] = await knex('users').insert({ name: 'FindMe', email: 'findme@example.com' });
        const response = await request(server).get(`/api/users/${id}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(id);
    });

    it('PUT /api/users/:id - should update a user with valid data', async () => {
        const [id] = await knex('users').insert({ name: 'Old', email: 'old@example.com' });
        const updatedData = { name: 'New', email: 'new@example.com' };
        const response = await request(server).put(`/api/users/${id}`).send(updatedData);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.email).toBe(updatedData.email);
    });

    it('DELETE /api/users/:id - should delete a user', async () => {
        const [id] = await knex('users').insert({ name: 'ToDelete', email: 'todelete@example.com' });
        const response = await request(server).delete(`/api/users/${id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/User deleted/);
    });
});
