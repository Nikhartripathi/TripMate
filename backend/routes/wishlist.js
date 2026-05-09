const express = require('express')
const router = express.Router()
const {
  getWishlist,
  addDestination,
  removeDestination,
  addHotel,
  removeHotel,
  addTransport,
  suggestHotels,
  clearWishlist,
} = require('../controllers/wishlistController')
const { protect } = require('../middleware/auth')

// All routes require login
router.use(protect)

router.get('/',                          getWishlist)
router.delete('/',                       clearWishlist)

router.post('/destinations',             addDestination)
router.delete('/destinations/:destId',   removeDestination)

router.post('/hotels',                   addHotel)
router.delete('/hotels/:hotelId',        removeHotel)

router.post('/transport',                addTransport)

router.get('/suggest-hotels',            suggestHotels)

module.exports = router