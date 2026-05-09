const express = require('express')
const router = express.Router()
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController')
const { protect } = require('../middleware/auth')

router.route('/')
  .get(getHotels)           // Public — browse/search hotels
  .post(protect, createHotel) // Protected — admin/seed use

router.route('/:id')
  .get(getHotelById)
  .put(protect, updateHotel)
  .delete(protect, deleteHotel)

module.exports = router