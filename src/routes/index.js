const express = require('express')

const router = express.Router()

//Import controller
const { register, login } = require('../controllers/user')
const { addJourney, getJourneys } = require('../controllers/journey')

//User
router.post('/register', register)
router.post('/login', login)

//Journey
router.post('/addJourney', addJourney)
router.get('/getJourneys', getJourneys)

module.exports = router