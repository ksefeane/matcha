const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const visitorController = require('../controllers/visitorController')

router.get('/', userController.auth, userController.list_users)

//router.get('/:map', userController.auth, visitorController.lost)

module.exports = router
