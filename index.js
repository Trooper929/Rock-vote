require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const userRoutes = require('./routes/userRoutes')
const issueRoutes = require('./routes/issueRoutes')
const commentRoutes = require('./routes/commentRoutes')

const app = express()

app.use(express.json())

// Routes
app.use('/api/users', userRoutes)
app.use('/api/issues', issueRoutes)
app.use('/api/comments', commentRoutes)

// Error handler
app.use((err, req, res, next) => {
  console.error(err)

  // express-jwt sends this error when token is missing or invalid
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid or missing token' })
  }

  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 4000

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.error('MongoDB connection error:', err))
