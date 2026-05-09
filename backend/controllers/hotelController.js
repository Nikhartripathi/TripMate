const Hotel = require('../models/Hotel')

// @desc    Get hotels by city with filters & pagination
// @route   GET /api/hotels?city=delhi&minPrice=500&maxPrice=5000&rating=4&page=1&limit=10
// @access  Public
const getHotels = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice, rating, category, search, page = 1, limit = 10, sort = 'rating' } = req.query

    const query = {}
    if (city)     query.city = { $regex: city, $options: 'i' }
    if (category) query.category = category
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    if (rating)   query.rating = { $gte: Number(rating) }
    if (search)   query.$text = { $search: search }

    const sortMap = {
      rating:    { rating: -1 },
      price_asc: { price: 1 },
      price_desc:{ price: -1 },
      newest:    { createdAt: -1 },
    }
    const sortObj = sortMap[sort] || { rating: -1 }
    const skip = (Number(page) - 1) * Number(limit)

    const [hotels, total] = await Promise.all([
      Hotel.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Hotel.countDocuments(query),
    ])

    res.status(200).json({
      success: true,
      hotels,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' })
    res.status(200).json({ success: true, hotel })
  } catch (err) {
    next(err)
  }
}

// @desc    Create hotel (admin use / seeding)
// @route   POST /api/hotels
// @access  Private
const createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body)
    res.status(201).json({ success: true, hotel })
  } catch (err) {
    next(err)
  }
}

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private
const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' })
    res.status(200).json({ success: true, hotel })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id)
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' })
    res.status(200).json({ success: true, message: 'Hotel deleted.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getHotels, getHotelById, createHotel, updateHotel, deleteHotel }