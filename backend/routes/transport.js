const express = require('express')
const router = express.Router()
const { getTransport } = require('../controllers/transportController')
const { protect } = require('../middleware/auth')

router.get('/', protect, getTransport)

module.exports = router