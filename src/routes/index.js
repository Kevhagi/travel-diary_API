const express = require('express')

const router = express.Router()

//Import controller
const { register, login, getUser, checkAuth, uploadImage } = require('../controllers/user')
const { addJourney, getJourneys, getPostedJourneys, getJourney, deleteJourney, editJourneyWithoutImage, editJourney } = require('../controllers/journey')
const { handleBookmark, getBookmarks } = require('../controllers/bookmark')

//Middlewares
const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile')

//User
router.post('/register', register)
router.post('/login', login)
router.get('/profile/:id', getUser)
router.patch('/profile/:id', uploadFile("image"), uploadImage)
router.get('/check-auth', auth, checkAuth)

//Journey
router.post('/journey', auth, uploadFile("image"), addJourney)
router.patch('/journey-noimage/:id', auth, editJourneyWithoutImage)
router.patch('/journey/:id', auth, uploadFile("image"), editJourney)
router.delete('/journey/:id', auth, deleteJourney)
router.get('/journeys', getJourneys)
router.get('/journey/:id', getJourney)
router.get('/profile/:id/journey', getPostedJourneys)

//Bookmark
router.post('/bookmark', auth, handleBookmark)
router.get('/bookmarks/:id', getBookmarks) //profile id

module.exports = router