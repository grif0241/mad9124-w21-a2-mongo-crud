const mongoose = require('mongoose')
// const Course = require('./Course')

const studentSchema = new mongoose.Schema({
  firstName: {type: String, maxlength: 64, required: true},
  lastName: {type: String, maxlength: 64, required: true}, 
  nickName: {type: String, maxlength: 64, required: false},
  email: {type: String, maxlength: 512, required: true}
})

const Model = mongoose.model('Student', studentSchema)
module.exports = Model