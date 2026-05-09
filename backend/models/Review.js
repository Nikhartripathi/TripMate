const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
    },
    images: [String],
  },
  { timestamps: true }
)

// One review per user per hotel
reviewSchema.index({ user: 1, hotel: 1 }, { unique: true })

// After saving, update hotel's average rating and reviewsCount
reviewSchema.post('save', async function () {
  const Hotel = require('Hotel')
  const stats = await this.constructor.aggregate([
    { $match: { hotel: this.hotel } },
    { $group: { _id: '$hotel', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  if (stats.length > 0) {
    await Hotel.findByIdAndUpdate(this.hotel, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewsCount: stats[0].count,
    })
  }
})

module.exports = mongoose.model('Review', reviewSchema)