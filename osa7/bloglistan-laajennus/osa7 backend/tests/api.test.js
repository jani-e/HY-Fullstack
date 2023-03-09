const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
let testToken = null

const login = async () => {
    const user = {
        'username': 'tester',
        'password': 'newPassu'
    }

    const userLogin = await api.post('/api/login')
        .send(user)

    testToken = userLogin._body.token.toString()
}

const initialBlogs = [
    {
        _id: '63a09cebeebf92af09f63263',
        url: 'http://www.testblog.blog/notarealone',
        title: 'Test blog',
        author: 'Jani',
        user: '63b3007ca1958d394cf1878e',
        likes: 7,
        __v: 0,

    },
    {
        _id: '5a422aa71b54a676234d17f8',
        url: 'http://www.testers.com/testing-for-dummies.html',
        title: 'Testing for Dummies',
        author: 'Dummy Tester',
        user: '63b3007ca1958d394cf1878e',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        url: 'http://www.third.co.uk/test_blog.html',
        title: 'Third\'s Test Blog',
        author: 'The Third',
        user: '63b3007ca1958d394cf1878e',
        likes: 10,
        __v: 0
    },
]

const testUser = [
    {
        _id: '63b3007ca1958d394cf1878e',
        username: 'tester',
        passwordHash: '$2a$05$arn547MLSACqVcWy9Ldy5.t8.LalaPYeV8sZCOfoBZM0167qbiVMO',
        name: 'testaaja',
        __v: 0
    }
]

beforeAll(async () => {
    await User.deleteMany({})
    await User.insertMany(testUser)
    await login()
})

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

describe('blogs api', () => {

    test('returns correct amount of blogs in json', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('returns blog with defined id field', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('accepts blogs, blog size increments & contains added blog', async () => {
        const newBlog = {
            title: 'A new test blog',
            author: 'By yours truly',
            url: 'http://www.legitwebsites.tv/blogs/testing.html',
            likes: 42
        }

        await api.post('/api/blogs')
            .set('Authorization', `bearer ${testToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length + 1)

        const titles = response.body.map(t => t.title)
        expect(titles).toContain('A new test blog')
    })

    test('sets default likes value to zero if likes value is not given', async () => {
        const newBlog = {
            title: 'Blog without likes value',
            author: 'Not a liker',
            url: 'http://www.notgivinganylikes.com/'
        }

        await api.post('/api/blogs')
            .set('Authorization', `bearer ${testToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const likes = response.body.map(l => l.likes)
        expect(likes.pop()).toBe(0)
    })

    test('responds with 400 Bad Request if title is missing', async () => {
        const newBlog = {
            author: 'Titleless blogger',
            url: 'http://www.antititles.it/bloggers.html'
        }

        await api.post('/api/blogs')
            .set('Authorization', `bearer ${testToken}`)
            .send(newBlog)
            .expect(400)
    })

    test('responds with 400 Bad Request if url is missing', async () => {
        const newBlog = {
            title: 'Blog without url',
            author: 'Not a good blogger',
        }

        await api.post('/api/blogs')
            .set('Authorization', `bearer ${testToken}`)
            .send(newBlog)
            .expect(400)
    })

    test('responds with 401 Unauthorized if requested without token', async () => {
        const newBlog = {
            title: 'Blog request without token',
            author: 'Tokenless'
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })

    describe('blog deletion', () => {

        test('can delete a single blog', async () => {
            const deletedBlog = initialBlogs[0]
            const deletedBlogId = deletedBlog._id
            await api.delete('/api/blogs/' + deletedBlogId)
                .set('Authorization', `bearer ${testToken}`)
                .send()
                .expect(204)

            const response = await api.get('/api/blogs')
            expect(response.body.length).toBe(initialBlogs.length - 1)
            expect(response.body).not.toContain(deletedBlog)
        })

        test('responds with 400 Bad Request if deletion id is invalid', async () => {
            const invalidId = 'qwertyuiopasdfghjklzxcvb'
            await api.delete('/api/blogs/' + invalidId)
                .set('Authorization', `bearer ${testToken}`)
                .send()
                .expect(400)

            const response = await api.get('/api/blogs')
            expect(response.body.length).toBe(initialBlogs.length)
        })
    })

    describe('blog editing', () => {

        test('can edit a single blog', async () => {
            const originalBlog = initialBlogs[0]
            const originalBlogId = originalBlog._id

            const updatedBlog = {
                ...originalBlog,
                likes: 9001
            }

            await api.put('/api/blogs/' + originalBlogId)
                .send(updatedBlog)
                .expect(200)

            const response = await api.get('/api/blogs')
            expect(response.body.length).toBe(initialBlogs.length)
            expect(response.body[0].title).toBe(originalBlog.title)
            expect(response.body[0].likes).toBe(9001)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})