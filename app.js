'use strict'

const mongoose = require('mongoose')
mongoose
  .connect('mongodb://localhost:27017/mad9124', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB...")
})
.catch((err) => {
  console.log("Problem connecting with MongoDB...", err.message)
  process.exit(1)
})

const morgan = require('morgan')
const express = require('express')
const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use('/api/students', require('./routes/students'))

const port = process.env.PORT || 3030
app.listen(port, () => {
  console.log(`HTTP server listening on port ${port}...`)
})