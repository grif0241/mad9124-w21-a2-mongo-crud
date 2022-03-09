const debug = require('debug')('sanitize:body')
const xss = require('xss')

module.exports = (req, res, next) => {
  // sanitization logic goes here
  next()
}