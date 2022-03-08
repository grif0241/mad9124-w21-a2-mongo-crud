const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String, 
  nickName: String,
  email: String
})
const Model = mongoose.model('Student', studentSchema)





module.exports = Model