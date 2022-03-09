'use strict'

const debug = require('debug')('mad9124-w21-a2-mongo-crud')
const express = require('express')
const morgan = require('morgan')
const sanitizeMongo = require('express-mongo-sanitize')

require('./startup/database')()

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(sanitizeMongo())

// routes
app.use('/api/students', require('./routes/students'))
app.use('/api/courses', require('./routes/courses'))

// package.json sets the development port to 3000 for testing

const port = process.env.PORT || 3030
app.listen(port, () => {
  debug(`HTTP server listening on port ${port}...`)
})