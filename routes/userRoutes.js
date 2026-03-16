const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

// POST /api/users/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' })
    }

    const user = await User.create({ username, password })

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(201).json({ user: user.removePassword(), token })
  } catch (err) {
    next(err)
  }
})

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.checkPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ user: user.removePassword(), token })
  } catch (err) {
    next(err)
  }
})

module.exports = router
