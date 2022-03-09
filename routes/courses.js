const Course = require('../models/Course')
const express = require('express')
const sanitizeBody = require('../middleware/sanitizeBody')
const router = express.Router()

// sanitizeBody on POST method
router.use('/', sanitizeBody)


// routes
router.get('/', async (req, res) => {
  const courses = await Course.find()
  res.send({data: courses})
})

router.post('/', async (req, res) => {
  let attributes = req.body
  delete attributes._id

  let newCourse = new Course(req.sanitizedBody)
  await newCourse.save()

  res.status(201).send({ data: newCourse})
})

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students')
    if (!course) {
      throw new Error ('Resource not found')
    }
    res.send({data: course})
  } catch(err) {
    sendResourceNotFound(req, res)
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { _id, ... otherAttributes } = req.body // destructure properties from id; don't trust client id
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes}, // set the id to the proper unique one from req.params.id
      {
        new: true,
        runValidators: true
      }
    )
    if (!course) throw new Error ('Resource not found!')
    res.send({data: course})
  } catch (err) {
    sendResourceNotFound(req, res) // throw not found error if cannot find student
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { _id, ... otherAttributes } = req.body // destructure properties from id; don't trust client id
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes}, // set the id to the proper unique one from req.params.id
      {
        new: true,
        runValidators: true,
        overwrite: true
      }
    )
    if (!course) throw new Error ('Resource not found!')
    res.send({data: course})
  } catch (err) {
    sendResourceNotFound(req, res) // throw not found error if cannot find student
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id)
    if (!course) throw new Error ('Resource not found')
    res.send({data: course})
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
        description: `We could not find a course with the id ${req.params.id}`
      }
    ]
  })
}

module.exports = router