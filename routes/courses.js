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

  try {
    let newCourse = new Course(req.sanitizedBody)
    await newCourse.save()
    res.status(201).json(formatResponseData(newCourse))
  } catch(err) {
    unableToCreateObject(req, res)
  }

})

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students')
    if (!course) {
      throw new Error ('Resource not found')
    }
    res.json(formatResponseData(course))
  } catch(err) {
    sendResourceNotFound(req, res)
  }
})

const update =
  (overwrite = false) => 
  async(req, res) => {
    try {
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite, 
          runValidators: true,
        }
      )
      if(!course) throw new Error('Resource not found')
      res.json(formatResponseData(course))
    } catch (err){
      sendResourceNotFound(req, res)
    }
  }

router.put('/:id', update(true))
router.patch('/:id', update(false))



router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id)
    if (!course) throw new Error ('Resource not found')
    res.json(formatResponseData(course))
  } catch(err) {
    sendResourceNotFound(req, res)
  }
})

// resource not found function for requests with specific id 
function sendResourceNotFound(req, res,) {
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

function formatResponseData(payload, type = 'courses') {
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