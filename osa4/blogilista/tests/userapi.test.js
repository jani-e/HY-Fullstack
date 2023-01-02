const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('user api', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        const hashedPass = await bcrypt.hash('secr', 5)
        const user = new User({
            username: 'tester',
            hashedPass,
            name: 'testaaja'
        })

        await user.save()
    })

    test('new user is added', async () => {
        const newUser = ({
            'username': 'newTester',
            'password': 'newPassu',
            'name': 'testaaja3'
        })

        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(2)

        const names = response.body.map(n => n.name)
        expect(names).toContain('testaaja3')
    })

    test('user not added with invalid username length', async () => {
        const newUser = ({
            'username': 'ab',
            'password': 'passu',
            'name': 'short'
        })

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username has to be at least 3 characters long')

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(1)
    })

    test('user not added with invalid password length', async () => {
        const newUser = ({
            'username': 'abcde',
            'password': 'pa',
            'name': 'short'
        })

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password has to be at least 3 characters long')

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(1)
    })

    test('user not added with missing username', async () => {
        const newUser = ({
            'password': 'passu',
            'name': 'invalid'
        })

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username is missing')

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(1)
    })

    test('user not added with missing password', async () => {
        const newUser = ({
            'username': 'abcde',
            'name': 'invalid'
        })

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password is missing')

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(1)
    })

    test('user not added without unique username', async () => {
        const newUser = ({
            'username': 'tester',
            'password': 'passu',
            'name': 'short'
        })

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('not a unique username')

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(1)
    })
})

afterAll(() => {
    mongoose.connection.close()
})