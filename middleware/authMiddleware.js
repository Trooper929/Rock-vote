const { expressjwt } = require('express-jwt')

const requireAuth = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
})

module.exports = { requireAuth }
