const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const profileController = require('../controllers/profileController')

router.get('/', adminController.auth, adminController.adminForm)

router.post('/', adminController.auth, adminController.processForm)

router.get('/blocks', profileController.auth, profileController.blockHistory)

module.exports = router
