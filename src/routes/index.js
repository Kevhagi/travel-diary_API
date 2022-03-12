const express = require('express')

const router = express.Router()

//Import controller
const { register, login, getUser, checkAuth } = require('../controllers/user')
const { addJourney, getJourneys, getPostedJourneys } = require('../controllers/journey')
const { handleBookmark, getBookmarks } = require('../controllers/bookmark')

//Middlewares
const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile')

//User
router.post('/register', register)
router.post('/login', login)
router.get('/profile/:id', getUser)
router.get('/check-auth', auth, checkAuth)

//Journey
router.post('/journey', auth, uploadFile("image"), addJourney)
router.get('/journeys', getJourneys)
router.get('/profile/:id/journey', getPostedJourneys)

//Bookmark
router.post('/bookmark', auth, handleBookmark)
router.get('/bookmarks/:id', getBookmarks) //profile id

module.exports = router