const express = require('express')
const bcrypt = require('bcryptjs')

const userDb = require('./userHelper.js')

const router = express.Router()

router.get('/', (req, res) => {
  res.status(201).json({ message: 'Users Route' })
})

router.post('/register', (req, res) => {
  let user = req.body

  const hash = bcrypt.hashSync(user.password, 12)
  user.password = hash

  userDb
    .add(user)
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

router.post('/login', (req, res) => {
  let { username, password } = req.body

  userDb
    .findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = userDb.generateToken(user)
        res.status(200).json({
          message: `${user.username} Logged in`,
          token
        })
      } else {
        res.status(401).json({ message: 'Not logged in' })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

module.exports = router
