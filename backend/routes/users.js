const express = require('express')
const router = express.Router()

const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
  deleteAccount,
} = require('../controllers/userController')


const { protect } = require('../middleware/auth')
const upload = require('../middleware/upload')

// ✅ Public routes (no token needed)

// 🔒 Protected routes
router.use(protect)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/profile/image', upload.single('profileImage'), uploadProfileImage)
router.put('/password', changePassword)
router.delete('/profile', deleteAccount)

module.exports = router

