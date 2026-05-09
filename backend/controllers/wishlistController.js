const Wishlist = require('../models/Wishlist')
const Hotel = require('../models/Hotel')

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('hotels', 'name city price rating images description amenities')

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, hotels: [], destinations: [] })
    }

    res.status(200).json({ success: true, wishlist })
  } catch (err) {
    next(err)
  }
}

// @desc    Add destination to wishlist
// @route   POST /api/wishlist/destinations
// @access  Private
const addDestination = async (req, res, next) => {
  try {
    const { name, country, city, image, description, tags } = req.body

    if (!name) {
      return res.status(400).json({ success: false, message: 'Destination name is required.' })
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, hotels: [], destinations: [] })
    }

    // Check if already exists
    const already = wishlist.destinations.find(d => d.name?.toLowerCase() === name.toLowerCase())
    if (already) {
      return res.status(400).json({ success: false, message: 'Destination already in wishlist.' })
    }

    wishlist.destinations.push({ name, country, city, image, description, tags: tags || [], addedAt: new Date() })
    await wishlist.save()

    res.status(200).json({ success: true, message: 'Destination added to wishlist.', wishlist })
  } catch (err) {
    next(err)
  }
}

// @desc    Remove destination from wishlist
// @route   DELETE /api/wishlist/destinations/:destId
// @access  Private
const removeDestination = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found.' })

    wishlist.destinations = wishlist.destinations.filter(d => d._id.toString() !== req.params.destId)
    await wishlist.save()

    res.status(200).json({ success: true, message: 'Destination removed.', wishlist })
  } catch (err) {
    next(err)
  }
}

// @desc    Add hotel to wishlist
// @route   POST /api/wishlist/hotels
// @access  Private
const addHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.body

    if (!hotelId) {
      return res.status(400).json({ success: false, message: 'hotelId is required.' })
    }

    const hotel = await Hotel.findById(hotelId)
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' })
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, hotels: [], destinations: [] })
    }

    if (wishlist.hotels.includes(hotelId)) {
      return res.status(400).json({ success: false, message: 'Hotel already in wishlist.' })
    }

    wishlist.hotels.push(hotelId)
    await wishlist.save()

    await wishlist.populate('hotels', 'name city price rating images description')

    res.status(200).json({ success: true, message: 'Hotel added to wishlist.', wishlist })
  } catch (err) {
    next(err)
  }
}

// @desc    Remove hotel from wishlist
// @route   DELETE /api/wishlist/hotels/:hotelId
// @access  Private
const removeHotel = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found.' })

    wishlist.hotels = wishlist.hotels.filter(h => h.toString() !== req.params.hotelId)
    await wishlist.save()

    res.status(200).json({ success: true, message: 'Hotel removed.', wishlist })
  } catch (err) {
    next(err)
  }
}

// @desc    Add transport to wishlist
// @route   POST /api/wishlist/transport
// @access  Private
const addTransport = async (req, res, next) => {
  try {
    const { mode, from, to, departureTime, arrivalTime, duration, price, operator, class: tClass } = req.body

    if (!mode || !from || !to) {
      return res.status(400).json({ success: false, message: 'Mode, from, and to are required.' })
    }

    if (!['flight', 'train', 'bus', 'cab'].includes(mode)) {
      return res.status(400).json({ success: false, message: 'Mode must be flight, train, bus, or cab.' })
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, hotels: [], destinations: [] })
    }

    // Add transport to destinations array as a transport item (or you can add a transport array to your schema)
    // Using destinations array with type='transport' for flexibility
    wishlist.destinations.push({
      name: `${from} → ${to}`,
      description: `${mode} | ${operator || ''} | ${tClass || ''}`,
      tags: ['transport', mode],
      transportDetails: { mode, from, to, departureTime, arrivalTime, duration, price: price || 0, operator, class: tClass },
      addedAt: new Date()
    })

    await wishlist.save()
    res.status(200).json({ success: true, message: 'Transport added to wishlist.', wishlist })
  } catch (err) {
    next(err)
  }
}

// @desc    Auto-suggest hotels near a destination using OpenStreetMap Nominatim + Overpass API (FREE)
// @route   GET /api/wishlist/suggest-hotels?destination=Goa
// @access  Private
const suggestHotels = async (req, res, next) => {
  try {
    const { destination } = req.query

    if (!destination) {
      return res.status(400).json({ success: false, message: 'destination query param is required.' })
    }

    // Step 1: Geocode the destination using Nominatim (free, no API key)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'TripMate/1.0 (tripmate@example.com)' } }
    )
    const geoData = await geoRes.json()

    if (!geoData || geoData.length === 0) {
      return res.status(404).json({ success: false, message: 'Destination not found on map.' })
    }

    const { lat, lon, display_name } = geoData[0]

    // Step 2: Use Overpass API to find hotels near coords (free, no API key)
    const overpassQuery = `
      [out:json][timeout:15];
      (
        node["tourism"="hotel"](around:10000,${lat},${lon});
        node["tourism"="hostel"](around:10000,${lat},${lon});
        node["tourism"="guest_house"](around:10000,${lat},${lon});
        way["tourism"="hotel"](around:10000,${lat},${lon});
      );
      out body 15;
    `

    const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: { 'Content-Type': 'text/plain' }
    })
    const overpassData = await overpassRes.json()

    // Format results
    const hotels = (overpassData.elements || [])
      .filter(el => el.tags && el.tags.name)
      .slice(0, 12)
      .map((el, i) => ({
        id: el.id,
        name: el.tags.name,
        type: el.tags.tourism || 'hotel',
        address: el.tags['addr:street'] ? `${el.tags['addr:street']}${el.tags['addr:city'] ? ', ' + el.tags['addr:city'] : ''}` : display_name,
        city: destination,
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        phone: el.tags.phone || el.tags['contact:phone'] || null,
        website: el.tags.website || el.tags['contact:website'] || null,
        stars: el.tags.stars || null,
        // Estimated price range based on type
        priceRange: el.tags.tourism === 'hostel' ? '₹500–₹1,500' : el.tags.stars >= 4 ? '₹4,000–₹12,000' : '₹1,500–₹4,000',
        source: 'OpenStreetMap',
      }))

    res.status(200).json({
      success: true,
      destination,
      location: { lat, lon, display_name },
      count: hotels.length,
      hotels,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found.' })

    wishlist.hotels = []
    wishlist.destinations = []
    await wishlist.save()

    res.status(200).json({ success: true, message: 'Wishlist cleared.', wishlist })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getWishlist,
  addDestination,
  removeDestination,
  addHotel,
  removeHotel,
  addTransport,
  suggestHotels,
  clearWishlist,
}