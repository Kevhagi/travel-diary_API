const express = require('express')

const router = express.Router()

//Import controller
const { register, login, getUser } = require('../controllers/user')
const { addJourney, getJourneys, getPostedJourneys } = require('../controllers/journey')
const { addBookmark, getBookmarks } = require('../controllers/bookmark')

//User
router.post('/register', register)
router.post('/login', login)
router.get('/profile/:id', getUser)

//Journey
router.post('/journey', addJourney)
router.get('/journeys', getJourneys)
router.get('/profile/:id/journey', getPostedJourneys)

//Bookmark
router.post('/bookmark', addBookmark)
router.get('/bookmarks/:id', getBookmarks) //profile id

module.exports = router