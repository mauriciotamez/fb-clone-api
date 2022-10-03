const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const app = express()

/* Controllers */

const { globalErrorHandler } = require('./src/controllers/error.controller')

/* Routers */
const { usersRouter } = require('./src/routes/users.routes')

/* Enable incoming JSON data */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* Compression and security headers */
app.use(compression())
app.use(helmet())

/* Endpoints */
app.use('/api/v1/users', usersRouter)

app.use(globalErrorHandler)

module.exports = { app }
