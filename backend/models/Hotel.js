const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    images: [
      {
        type: String, // URLs
      },
    ],
    description: {
      type: String,
      default: '',
    },
    amenities: [String],
    category: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury', 'hostel', 'resort'],
      default: 'mid-range',
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Text index for search
hotelSchema.index({ name: 'text', city: 'text', description: 'text' })

module.exports = mongoose.model('Hotel', hotelSchema)