const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  code: {type: String, maxlength: 16, required: true},
  title: {type: String, maxlength: 255, required: true}, 
  description: {type: String, maxlength: 2048, required: false},
  url: {type: String, maxlength: 512, required: false},
  students: {type: Array, required: false}
})
const Model = mongoose.model('Course', courseSchema)





module.exports = Model