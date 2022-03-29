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
    res.status(201).json(formatResponseData(newStudent)) 
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
    res.json(formatResponseData(student))
  } catch(err) {
    sendResourceNotFound(req, res)
  }
})

const update =
  (overwrite = false) => 
  async(req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite, 
          runValidators: true,
        }
      )
      if(!student) throw new Error('Resource not found')
      res.json(formatResponseData(student))
    } catch (err){
      sendResourceNotFound(req, res)
    }
  }

router.put('/:id', update(true))
router.patch('/:id', update(false))


router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id)
    if (!student) throw new Error ('Resource not found')
    res.json(formatResponseData(student))
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

function formatResponseData(payload, type = 'students') {
  if (payload instanceof Array) {
    return {data: payload.map(resource => format(resource))}
  } else {
    return {data: format(payload)}
  }
  function format(resource) {
    const {_id, ... attributes} = resource.toJSON ? resource.toJSON() : resource
    return {type, id: _id, attributes}
  }
}

module.exports = router