require('dotenv').config()
const jwt = require('jsonwebtoken')

const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  request.user = decodedToken.id.toString()
  next()
}

module.exports = userExtractor