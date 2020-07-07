const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const profileController = require('../controllers/profileController')

router.get('/', profileController.auth, userController.list_users)

//router.get('/s', profileController.auth, userController.search_users)

router.post('/', profileController.auth, userController.find_users)


//router.get('/:map', userController.auth, visitorController.lost)

module.exports = router
