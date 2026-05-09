// ============================================================
// Frontend Axios API calls for Wishlist
// Place this file at: frontend/src/api/wishlistApi.js
// ============================================================
import api from './axios'

// ── Get full wishlist ──────────────────────────────────────
export const getWishlist = async () => {
  const res = await api.get('/wishlist')
  return res.data.wishlist
}

// ── Add destination ────────────────────────────────────────
export const addDestination = async (destination) => {
  // destination = { name, country, city, image, description, tags }
  const res = await api.post('/wishlist/destinations', destination)
  return res.data.wishlist
}

// ── Remove destination ─────────────────────────────────────
export const removeDestination = async (destId) => {
  const res = await api.delete(`/wishlist/destinations/${destId}`)
  return res.data.wishlist
}

// ── Add hotel ──────────────────────────────────────────────
export const addHotel = async (hotelId) => {
  const res = await api.post('/wishlist/hotels', { hotelId })
  return res.data.wishlist
}

// ── Remove hotel ───────────────────────────────────────────
export const removeHotel = async (hotelId) => {
  const res = await api.delete(`/wishlist/hotels/${hotelId}`)
  return res.data.wishlist
}

// ── Add transport ──────────────────────────────────────────
export const addTransport = async (transport) => {
  // transport = { mode, from, to, departureTime, arrivalTime, duration, price, operator, class }
  const res = await api.post('/wishlist/transport', transport)
  return res.data.wishlist
}

// ── Auto-suggest hotels near a destination (FREE API) ──────
export const suggestHotels = async (destination) => {
  const res = await api.get(`/wishlist/suggest-hotels?destination=${encodeURIComponent(destination)}`)
  return res.data // { hotels, location, count }
}

// ── Clear entire wishlist ──────────────────────────────────
export const clearWishlist = async () => {
  const res = await api.delete('/wishlist')
  return res.data.wishlist
}


// ============================================================
// Example usage in a React component:
// ============================================================

/*
import {
  getWishlist, addDestination, removeDestination,
  addHotel, removeHotel, addTransport, suggestHotels
} from '../api/wishlistApi'

// Fetch wishlist on load
useEffect(() => {
  getWishlist().then(setWishlist).catch(console.error)
}, [])

// Add a destination
await addDestination({ name: 'Goa', country: 'India', city: 'Panaji', description: 'Beach paradise' })

// Add a hotel by its MongoDB _id
await addHotel('64abc123def456...')

// Add a transport option
await addTransport({
  mode: 'flight',
  from: 'Mumbai',
  to: 'Goa',
  departureTime: '08:30 AM',
  arrivalTime: '09:45 AM',
  duration: '1h 15m',
  price: 3500,
  operator: 'IndiGo',
  class: 'Economy'
})

// Auto-suggest hotels near a destination (uses free OpenStreetMap)
const { hotels, location } = await suggestHotels('Goa')
console.log(hotels) 
// [{ name: 'Hotel XYZ', type: 'hotel', address: '...', priceRange: '₹2000–₹5000', ... }]
*/