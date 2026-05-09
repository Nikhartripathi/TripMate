const express = require('express')
const router = express.Router()
const {
  getHotelReviews,
  addReview,
  updateReview,
  deleteReview,
  getMyReviews,
} = require('../controllers/reviewController')
const { protect } = require('../middleware/auth')

router.get('/my',                    protect, getMyReviews)
router.get('/hotel/:hotelId',        getHotelReviews)
router.post('/hotel/:hotelId',       protect, addReview)
router.put('/:id',                   protect, updateReview)
router.delete('/:id',                protect, deleteReview)

module.exports = router