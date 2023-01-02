const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    if (body.likes === undefined) {
        body.likes = 0
    }

    if (body.title === undefined || body.url === undefined) {
        response.status(400).end()
    } else {
        const blog = new Blog({
            url: body.url,
            title: body.title,
            author: body.author,
            user: user._id,
            likes: body.likes
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blogId = request.params.id
    const user = request.user
    const userId = user._id

    const blog = await Blog.findById(blogId)

    if (blog === null) {
        return response.status(404).json({
            error: 'blog not found'
        })
    }

    if (blog.user.toString() === userId.toString()) {
        await Blog.findByIdAndDelete(blogId)
        return response.status(204).end()
    } else {
        return response.status(401).json({
            error: 'incorrect user'
        })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = await request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter