const express = require('express')

const router = express.Router()

//Import controller
const { register, login, getUser } = require('../controllers/user')
const { addJourney, getJourneys, getPostedJourneys } = require('../controllers/journey')
const { addBookmark, getBookmarks } = require('../controllers/bookmark')

//Middlewares
const { auth } = require('../middlewares/auth')

//User
router.post('/register', register)
router.post('/login', login)
router.get('/profile/:id', getUser)

//Journey
router.post('/journey', auth, addJourney)
router.get('/journeys', getJourneys)
router.get('/profile/:id/journey', getPostedJourneys)

//Bookmark
router.post('/bookmark', auth, addBookmark)
router.get('/bookmarks/:id', getBookmarks) //profile id

module.exports = router