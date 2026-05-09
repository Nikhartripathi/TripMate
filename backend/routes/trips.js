const express = require('express')
const router = express.Router()
const {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  generateTripItinerary,
  addHotelToTrip,
  addTransportToTrip,
} = require('../controllers/tripController')
const { protect } = require('../middleware/auth')

router.use(protect) // all trip routes require login

router.route('/')
  .get(getUserTrips)
  .post(createTrip)

router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip)

router.post('/:id/itinerary',  generateTripItinerary)
router.post('/:id/hotels',     addHotelToTrip)
router.post('/:id/transport',  addTransportToTrip)

module.exports = router