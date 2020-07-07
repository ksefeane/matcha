const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const chatController = require('../controllers/chatController')

router.get('/', profileController.auth, chatController.messages)

router.get('/:match', profileController.auth, chatController.auth, chatController.chat)

module.exports = router
