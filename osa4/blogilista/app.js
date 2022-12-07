const { MONGODB_URI } = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware')
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
app.use('/api/blogs', blogsRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app