const debug = require('debug')('sanitize:body')
const xss = require('xss')

const sanitize = sourceString => {
  return xss(sourceString, {
    whiteList: [], // filter out all tags
    stripIgnoreTag: true, // filter html not in whiteList
    stripIgnoreTagBody: ['script'] // filter out script tag CONTENT
  })
}

// function from lab notes:
// recursively going deeper into an Array/Object and repeatedly sanitize tags
const stripTags = payload => {
  let attributes = { ...payload } // don't mutate the source data
  for (let key in attributes) {
    if (attributes[key] instanceof Array) {
      attributes[key] = attributes[key].map(element => {
        return typeof element === 'string'
          ? sanitize(element) // if true
          : stripTags(element) // if false
      })
    } else if (attributes[key] instanceof Object) {
      attributes[key] = stripTags(attributes[key])
    } else {
      attributes[key] = sanitize(attributes[key])
    }
  }
  return attributes
}

module.exports = (req, res, next) => {
  const { id, _id, ...attributes } = req.body
  const sanitizedBody = stripTags(attributes)
  req.sanitizedBody = sanitizedBody
  next()
}



