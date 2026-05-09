const Trip = require('../models/Trip')
const User = require('../models/User')
const { generateItinerary } = require('../utils/itineraryGenerator')

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res, next) => {
  try {
    const { source, destination, startDate, endDate, budget, travelers, title } = req.body

    if (!source || !destination) {
      return res.status(400).json({ success: false, message: 'Source and destination are required.' })
    }

    const trip = await Trip.create({
      user: req.user.id,
      title: title || `${source} → ${destination}`,
      source,
      destination,
      startDate,
      endDate,
      budget: budget || 0,
      travelers: travelers || { count: 1, type: 'solo' },
    })

    // Add to user's savedTrips
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { savedTrips: trip._id } })

    res.status(201).json({ success: true, trip })
  } catch (err) {
    next(err)
  }
}

// @desc    Get all trips for logged-in user
// @route   GET /api/trips
// @access  Private
const getUserTrips = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query

    const query = { user: req.user.id }
    if (status) query.status = status
    if (search) query.destination = { $regex: search, $options: 'i' }

    const skip = (Number(page) - 1) * Number(limit)
    const [trips, total] = await Promise.all([
      Trip.find(query)
        .populate('hotels', 'name city price rating images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Trip.countDocuments(query),
    ])

    res.status(200).json({
      success: true,
      trips,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get a single trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('hotels user', 'name city price rating images name email')

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' })
    if (trip.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this trip.' })
    }

    res.status(200).json({ success: true, trip })
  } catch (err) {
    next(err)
  }
}

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id)
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' })
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this trip.' })
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200).json({ success: true, trip })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' })
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this trip.' })
    }

    await trip.deleteOne()
    await User.findByIdAndUpdate(req.user.id, { $pull: { savedTrips: trip._id } })

    res.status(200).json({ success: true, message: 'Trip deleted.' })
  } catch (err) {
    next(err)
  }
}

// @desc    Generate AI itinerary for a trip
// @route   POST /api/trips/:id/itinerary
// @access  Private
const generateTripItinerary = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' })
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' })
    }

    const itinerary = generateItinerary({
      destination: trip.destination,
      source: trip.source,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      travelers: trip.travelers,
    })

    trip.itinerary = itinerary
    await trip.save()

    res.status(200).json({ success: true, itinerary, trip })
  } catch (err) {
    next(err)
  }
}

// @desc    Add hotel to trip
// @route   POST /api/trips/:id/hotels
// @access  Private
const addHotelToTrip = async (req, res, next) => {
  try {
    const { hotelId } = req.body
    if (!hotelId) return res.status(400).json({ success: false, message: 'hotelId is required.' })

    const trip = await Trip.findById(req.params.id)
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' })
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' })
    }

    if (!trip.hotels.includes(hotelId)) trip.hotels.push(hotelId)
    await trip.save()

    res.status(200).json({ success: true, trip })
  } catch (err) {
    next(err)
  }
}

// @desc    Add transport to trip
// @route   POST /api/trips/:id/transport
// @access  Private
const addTransportToTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' })
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' })
    }

    trip.transport.push(req.body)
    await trip.save()

    res.status(200).json({ success: true, trip })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  generateTripItinerary,
  addHotelToTrip,
  addTransportToTrip,
}