const mongoose = require('mongoose')

const destinationSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  country:     { type: String, default: '' },
  city:        { type: String, default: '' },
  image:       { type: String, default: '' },
  description: { type: String, default: '' },
  tags:        [{ type: String }],
  transportDetails: {
    mode:          { type: String, enum: ['flight','train','bus','cab'] },
    from:          String,
    to:            String,
    departureTime: String,
    arrivalTime:   String,
    duration:      String,
    price:         { type: Number, default: 0 },
    operator:      String,
    class:         String,
  },
  addedAt: { type: Date, default: Date.now },
})

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    hotels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
      },
    ],
    destinations: [destinationSchema],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Wishlist', wishlistSchema)