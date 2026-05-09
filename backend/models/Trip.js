const mongoose = require('mongoose')

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, default: '' },
  activities: [
    {
      time: String,
      activity: String,
      type: { type: String, enum: ['place', 'food', 'transport', 'hotel', 'other'], default: 'other' },
      cost: { type: Number, default: 0 },
    },
  ],
})

const transportSchema = new mongoose.Schema({
  mode: { type: String, enum: ['flight', 'train', 'bus', 'cab'], required: true },
  from: String,
  to: String,
  departureTime: String,
  arrivalTime: String,
  duration: String,
  price: Number,
  operator: String,
  class: String,
})

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      required: [true, 'Source city is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
      default: 0,
    },
    travelers: {
      count: { type: Number, default: 1 },
      type: { type: String, enum: ['solo', 'friends', 'family', 'couple'], default: 'solo' },
    },
    itinerary: [itineraryDaySchema],
    hotels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
      },
    ],
    transport: [transportSchema],
    status: {
      type: String,
      enum: ['planned', 'booked', 'cancelled', 'completed'],
      default: 'planned',
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Trip', tripSchema)