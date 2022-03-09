const debug = require('debug')("mad9124-w21-a2-mongo-crud")
const mongoose = require('mongoose')

module.exports = () => {
  mongoose
    .connect(`mongodb://localhost:27017/mad9124`, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true
    })
    .then(() => {
      console.log(`Connected to MongoDB ...`)
    })
    .catch(err => {
      console.log(`Error connecting to MongoDB ...`, err.message)
      process.exit(1)
    })
}