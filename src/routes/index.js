const express = require('express')

const router = express.Router()

//Import controller
const { register, login } = require('../controllers/user')

//User
router.post('/register', register)
router.post('/login', login)

module.exports = router