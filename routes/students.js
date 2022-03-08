const Student = require('../models/Student')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const students = await Student.find()
  res.send({data: students})
})

router.post('/', async (req, res) => {
  let attributes = req.body
  delete attributes._id

  let newStudent = new Student(attributes)
  await newStudent.save()

  res.status(201).send({ data: newStudent})
})

router.get('/:id', async (req, res) => {})

router.patch('/:id', async (req, res) => {})

router.put('/:id', async (req, res) => {})

router.delete('/:id', async (req, res) => {})

module.exports = router