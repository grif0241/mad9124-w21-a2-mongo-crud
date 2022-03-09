// const sanitizeBody = require('./middleware/sanitizeBody')
const Student = require('../models/Student')
const express = require('express')
const sanitizeBody = require('../middleware/sanitizeBody')
const router = express.Router()

// sanitizeBody on POST method
router.use('/', sanitizeBody)

// routes
router.get('/', async (req, res) => {
  const students = await Student.find()
  res.send({data: students})
})

router.post('/', async (req, res) => {
  let attributes = req.body
  delete attributes._id

  try {
    let newStudent = new Student(req.sanitizedBody)
    await newStudent.save()
    res.status(201).send({ data: newStudent}) 
  } catch(err) {
    unableToCreateObject(req, res)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      throw new Error ('Resource not found')
    }
    res.send({data: student})
  } catch(err) {
    sendResourceNotFound(req, res)
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { _id, ... otherAttributes } = req.body // destructure properties from id; don't trust client id
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes}, // set the id to the proper unique one from req.params.id
      {
        new: true,
        runValidators: true
      }
    )
    if (!student) throw new Error ('Resource not found!')
    res.send({data: student})
  } catch (err) {
    sendResourceNotFound(req, res) // throw not found error if cannot find student
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { _id, ... otherAttributes } = req.body // destructure properties from id; don't trust client id
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes}, // set the id to the proper unique one from req.params.id
      {
        new: true,
        runValidators: true,
        overwrite: true
      }
    )
    if (!student) throw new Error ('Resource not found!')
    res.send({data: student})
  } catch (err) {
    sendResourceNotFound(req, res) // throw not found error if cannot find student
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id)
    if (!student) throw new Error ('Resource not found')
    res.send({data: student})
  } catch(err) {
    sendResourceNotFound(req, res)
  }
})

// resource not found function for requests with specific id 
function sendResourceNotFound(req, res) {
  res.status(404).send({
    errors: [
      {
        status: '404',
        title: 'Resource does not exist',
        description: `We could not find a student with the id ${req.params.id}`
      }
    ]
  })
}
// error for bad post
function unableToCreateObject(req, res) {
  res.status(422).send({
    errors: [
      {
        status: '422',
        title: 'Unprocessable Entity ',
        description: `The server understands the content type and syntax of the request entity, but still server is unable to process the request for some reason.`
      }
    ]
  })
}

module.exports = router