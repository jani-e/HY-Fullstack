const { MONGODB_URI } = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { requestLogger, unknownEndpoint, errorHandler, tokenExtractor } = require('./utils/middleware')
const { info, error } = require('./utils/logger')
const mongoose = require('mongoose')

info(`Connecting to ${MONGODB_URI}`)

mongoose.connect(MONGODB_URI)
    .then(() => {
        info('Connected')
    })
    .catch((error_msg) => {
        error(`Error connecting: ${error_msg}`)
    })

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app