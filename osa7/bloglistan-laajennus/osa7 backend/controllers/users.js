const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, password, name } = request.body

    if (username === undefined) {
        return response.status(400).json({
            error: 'username is missing'
        })
    }

    if (password === undefined) {
        return response.status(400).json({
            error: 'password is missing'
        })
    }

    if (username.length < 3) {
        return response.status(400).json({
            error: 'username has to be at least 3 characters long'
        })
    }

    if (password.length < 3) {
        return response.status(400).json({
            error: 'password has to be at least 3 characters long'
        })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
            error: 'not a unique username'
        })
    }

    const saltRounds = 5
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        passwordHash,
        name
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

module.exports = usersRouter