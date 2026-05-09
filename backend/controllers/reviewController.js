const Review = require('../models/Review')
const Hotel = require('../models/Hotel')

// @desc    Get all reviews for a hotel
// @route   GET /api/reviews/hotel/:hotelId
// @access  Public
const getHotelReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const [reviews, total] = await Promise.all([
      Review.find({ hotel: req.params.hotelId })
        .populate('user', 'name profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ hotel: req.params.hotelId }),
    ])

    res.status(200).json({
      success: true,
      reviews,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Add a review to a hotel
// @route   POST /api/reviews/hotel/:hotelId
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required.' })
    }

    const hotel = await Hotel.findById(req.params.hotelId)
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' })

    const existing = await Review.findOne({ user: req.user.id, hotel: req.params.hotelId })
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this hotel.' })
    }

    const review = await Review.create({
      user: req.user.id,
      hotel: req.params.hotelId,
      rating: Number(rating),
      comment,
    })

    await review.populate('user', 'name profileImage')

    res.status(201).json({ success: true, review })
  } catch (err) {
    next(err)
  }
}

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' })
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review.' })
    }

    const { rating, comment } = req.body
    if (rating) review.rating = Number(rating)
    if (comment) review.comment = comment
    await review.save()

    res.status(200).json({ success: true, review })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' })
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review.' })
    }

    await review.deleteOne()
    res.status(200).json({ success: true, message: 'Review deleted.' })
  } catch (err) {
    next(err)
  }
}

// @desc    Get all reviews by logged-in user
// @route   GET /api/reviews/my
// @access  Private
const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('hotel', 'name city images')
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, reviews })
  } catch (err) {
    next(err)
  }
}

module.exports = { getHotelReviews, addReview, updateReview, deleteReview, getMyReviews }