const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const profileController = require('../controllers/profileController')

router.get('/', profileController.auth, userController.list_users)

router.post('/', profileController.auth, userController.suggestions_param)

router.get('/search/:filter/:find', profileController.auth, userController.search)

router.post('/filter', profileController.auth, userController.filter)

router.post('/filter/:filter/:find', profileController.auth, userController.filter)

module.exports = router
