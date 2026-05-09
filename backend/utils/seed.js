require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Hotel = require('../models/Hotel')
const Trip = require('../models/Trip')
const Wishlist = require('../models/Wishlist')
const Review = require('../models/Review')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tripmate'

// ── 20 Hotels ────────────────────────────────────────────────────────────────
const HOTELS = [
  {
    name: 'The Leela Palace',
    city: 'delhi',
    address: 'Diplomatic Enclave, Chanakyapuri, New Delhi',
    price: 12000,
    rating: 4.8,
    category: 'luxury',
    description: 'Award-winning luxury hotel in the heart of New Delhi with palatial rooms and world-class amenities.',
    amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'Gym', 'Concierge', 'Valet'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    reviewsCount: 1240,
  },
  {
    name: 'Taj Mahal Hotel',
    city: 'mumbai',
    address: 'Apollo Bunder, Colaba, Mumbai',
    price: 18000,
    rating: 4.9,
    category: 'luxury',
    description: 'Iconic heritage hotel overlooking the Gateway of India, a landmark of elegance since 1903.',
    amenities: ['Pool', 'Spa', 'Fine Dining', 'Bar', 'Gym', 'Butler Service'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    reviewsCount: 3200,
  },
  {
    name: 'Samode Haveli',
    city: 'jaipur',
    address: 'Gangapole, Jaipur',
    price: 8500,
    rating: 4.7,
    category: 'luxury',
    description: 'A beautifully restored 475-year-old haveli with hand-painted interiors and a rooftop pool.',
    amenities: ['Pool', 'Heritage Dining', 'Yoga', 'Guided Tours'],
    images: ['https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=800'],
    reviewsCount: 780,
  },
  {
    name: 'Coco Shambhala',
    city: 'goa',
    address: 'Anjuna Beach Road, North Goa',
    price: 5500,
    rating: 4.5,
    category: 'resort',
    description: 'Boutique beach resort with infinity pool, lush gardens, and direct beach access.',
    amenities: ['Beach Access', 'Pool', 'Spa', 'Yoga', 'Restaurant'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    reviewsCount: 450,
  },
  {
    name: 'The Lalit Ashok',
    city: 'bangalore',
    address: 'Kumara Krupa High Grounds, Bangalore',
    price: 6800,
    rating: 4.4,
    category: 'luxury',
    description: 'Grand property set amidst lush gardens offering contemporary luxury in Garden City.',
    amenities: ['Pool', 'Spa', 'Multiple Dining', 'Gym', 'Bar'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    reviewsCount: 620,
  },
  {
    name: 'Taj Falaknuma Palace',
    city: 'hyderabad',
    address: 'Engine Bowli, Falaknuma, Hyderabad',
    price: 22000,
    rating: 4.9,
    category: 'luxury',
    description: 'Once the palace of Nizam of Hyderabad, now an unparalleled luxury experience atop a hill.',
    amenities: ['Palace Dining', 'Pool', 'Spa', 'Heritage Tours', 'Butler'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
    reviewsCount: 1890,
  },
  {
    name: 'The Oberoi Grand',
    city: 'kolkata',
    address: 'Jawaharlal Nehru Road, Kolkata',
    price: 9000,
    rating: 4.6,
    category: 'luxury',
    description: 'Colonial-era grand dame of Kolkata, impeccably restored with modern luxury.',
    amenities: ['Pool', 'Spa', 'Fine Dining', 'Gym', 'Business Center'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    reviewsCount: 980,
  },
  {
    name: 'ITC Grand Chola',
    city: 'chennai',
    address: 'Mount Road, Chennai',
    price: 11000,
    rating: 4.7,
    category: 'luxury',
    description: 'Inspired by the great Chola dynasty, this hotel is a living ode to South Indian heritage.',
    amenities: ['Multiple Pools', 'Spa', 'Authentic Dining', 'Gym', 'Shopping Arcade'],
    images: ['https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=800'],
    reviewsCount: 1100,
  },
  {
    name: 'BrijRama Palace',
    city: 'varanasi',
    address: 'Darbhanga Ghat, Varanasi',
    price: 14000,
    rating: 4.8,
    category: 'luxury',
    description: 'A 250-year-old palace on the ghats of the Ganges offering an ethereal spiritual retreat.',
    amenities: ['Ganga View Rooms', 'Rooftop Restaurant', 'Ghat Access', 'Yoga', 'Spa'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
    reviewsCount: 560,
  },
  {
    name: 'Taj Lake Palace',
    city: 'udaipur',
    address: 'Lake Pichola, Udaipur',
    price: 25000,
    rating: 5.0,
    category: 'luxury',
    description: 'A white marble palace floating on Lake Pichola — one of the most romantic hotels on Earth.',
    amenities: ['Lake View', 'Pool', 'Spa', 'Fine Dining', 'Royal Boat Transfers'],
    images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'],
    reviewsCount: 4200,
  },
  {
    name: 'FabHotel Indore Inn',
    city: 'indore',
    address: 'Vijay Nagar, Indore',
    price: 1800,
    rating: 3.8,
    category: 'budget',
    description: 'Clean and comfortable budget stay in Indore\'s commercial hub with all essentials.',
    amenities: ['Free WiFi', 'AC', 'TV', '24hr Reception'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    reviewsCount: 340,
  },
  {
    name: 'Treebo Trend Bhopal',
    city: 'bhopal',
    address: 'MP Nagar Zone-2, Bhopal',
    price: 2200,
    rating: 4.0,
    category: 'mid-range',
    description: 'Modern mid-range hotel with great connectivity to major attractions in Bhopal.',
    amenities: ['Free WiFi', 'Restaurant', 'Parking', 'AC'],
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
    reviewsCount: 210,
  },
  {
    name: 'Hotel Surya',
    city: 'varanasi',
    address: 'The Mall, Varanasi',
    price: 3500,
    rating: 4.1,
    category: 'mid-range',
    description: 'A heritage mid-range hotel near Ganga ghats, popular with cultural travellers.',
    amenities: ['Garden', 'Restaurant', 'Free WiFi', 'Tour Desk'],
    images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
    reviewsCount: 430,
  },
  {
    name: 'Zostel Jaipur',
    city: 'jaipur',
    address: 'Hawa Mahal Road, Jaipur',
    price: 800,
    rating: 4.3,
    category: 'hostel',
    description: 'Vibrant backpacker hostel steps from Hawa Mahal, great for solo and budget travellers.',
    amenities: ['Dorm Beds', 'Common Room', 'Rooftop', 'Events', 'Free WiFi'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    reviewsCount: 670,
  },
  {
    name: 'Lemon Tree Hotel',
    city: 'pune',
    address: 'Baner, Pune',
    price: 4500,
    rating: 4.2,
    category: 'mid-range',
    description: 'Contemporary business-leisure hotel in Pune\'s IT corridor with vibrant interiors.',
    amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi'],
    images: ['https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800'],
    reviewsCount: 510,
  },
  {
    name: 'House of MG',
    city: 'ahmedabad',
    address: 'Opposite Sidi Saiyed Mosque, Ahmedabad',
    price: 5800,
    rating: 4.5,
    category: 'luxury',
    description: '1924 heritage mansion transformed into a boutique hotel with authentic Gujarati hospitality.',
    amenities: ['Heritage Restaurant', 'Garden', 'Craft Shop', 'Free WiFi'],
    images: ['https://images.unsplash.com/photo-1477120128765-a0528148fed6?w=800'],
    reviewsCount: 390,
  },
  {
    name: 'Radisson Blu Agra',
    city: 'agra',
    address: 'Taj Nagri Phase II, Agra',
    price: 7000,
    rating: 4.4,
    category: 'luxury',
    description: 'Contemporary luxury hotel a short drive from Taj Mahal with rooftop views.',
    amenities: ['Pool', 'Spa', 'Rooftop Dining', 'Gym', 'Bar'],
    images: ['https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800'],
    reviewsCount: 750,
  },
  {
    name: 'OYO Flagship Delhi Central',
    city: 'delhi',
    address: 'Paharganj, New Delhi',
    price: 1500,
    rating: 3.5,
    category: 'budget',
    description: 'Affordable, clean stay near New Delhi Railway Station, perfect for transit travellers.',
    amenities: ['Free WiFi', 'AC', '24hr Check-in'],
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    reviewsCount: 1200,
  },
  {
    name: 'Ginger Mumbai Airport',
    city: 'mumbai',
    address: 'Andheri East, Mumbai',
    price: 3200,
    rating: 4.0,
    category: 'mid-range',
    description: 'Smart budget-premium stay minutes from Mumbai International Airport with great value.',
    amenities: ['Free WiFi', 'Restaurant', 'Gym', 'AC', 'Airport Transfer'],
    images: ['https://images.unsplash.com/photo-1605346576608-92a5b1e6cc8a?w=800'],
    reviewsCount: 890,
  },
  {
    name: 'Wildflower Hall',
    city: 'shimla',
    address: 'Chharabra, Shimla',
    price: 16000,
    rating: 4.8,
    category: 'resort',
    description: 'Stunning mountain resort set in cedar forests with breathtaking Himalayan views.',
    amenities: ['Heated Pool', 'Spa', 'Hiking', 'Fine Dining', 'Bonfire Area'],
    images: ['https://images.unsplash.com/photo-1467226632440-65f0b4957563?w=800'],
    reviewsCount: 680,
  },
]

// ── 10 Users ──────────────────────────────────────────────────────────────────
const USERS_RAW = [
  { name: 'Aarav Sharma',   email: 'aarav@example.com',   phone: '+91 98765 43210', password: 'password123' },
  { name: 'Priya Mehta',    email: 'priya@example.com',   phone: '+91 87654 32109', password: 'password123' },
  { name: 'Rohan Verma',    email: 'rohan@example.com',   phone: '+91 76543 21098', password: 'password123' },
  { name: 'Sneha Patel',    email: 'sneha@example.com',   phone: '+91 65432 10987', password: 'password123' },
  { name: 'Karan Singh',    email: 'karan@example.com',   phone: '+91 54321 09876', password: 'password123' },
  { name: 'Ananya Joshi',   email: 'ananya@example.com',  phone: '+91 43210 98765', password: 'password123' },
  { name: 'Vikram Nair',    email: 'vikram@example.com',  phone: '+91 32109 87654', password: 'password123' },
  { name: 'Meera Iyer',     email: 'meera@example.com',   phone: '+91 21098 76543', password: 'password123' },
  { name: 'Arjun Reddy',    email: 'arjun@example.com',   phone: '+91 10987 65432', password: 'password123' },
  { name: 'Kavya Krishnan', email: 'kavya@example.com',   phone: '+91 90876 54321', password: 'password123' },
]

// ── 15 Trips ──────────────────────────────────────────────────────────────────
const TRIPS_RAW = [
  { source: 'Indore',    destination: 'Goa',       budget: 35000, travelers: { count: 4, type: 'friends' }, status: 'booked',    title: 'Goa Beach Party 🏖️' },
  { source: 'Mumbai',    destination: 'Jaipur',     budget: 20000, travelers: { count: 2, type: 'couple'  }, status: 'planned',   title: 'Royal Rajasthan 👑' },
  { source: 'Delhi',     destination: 'Goa',        budget: 25000, travelers: { count: 3, type: 'friends' }, status: 'planned',   title: 'Delhi to Goa Escape' },
  { source: 'Bangalore', destination: 'Udaipur',    budget: 45000, travelers: { count: 2, type: 'couple'  }, status: 'booked',    title: 'Udaipur Honeymoon 🌹' },
  { source: 'Chennai',   destination: 'Varanasi',   budget: 18000, travelers: { count: 1, type: 'solo'    }, status: 'planned',   title: 'Spiritual Journey' },
  { source: 'Pune',      destination: 'Shimla',     budget: 28000, travelers: { count: 4, type: 'family'  }, status: 'booked',    title: 'Himalayan Family Trip' },
  { source: 'Hyderabad', destination: 'Mumbai',     budget: 15000, travelers: { count: 2, type: 'friends' }, status: 'completed', title: 'Mumbai Weekend' },
  { source: 'Kolkata',   destination: 'Agra',       budget: 22000, travelers: { count: 3, type: 'friends' }, status: 'planned',   title: 'Taj Mahal Trip 🕌' },
  { source: 'Ahmedabad', destination: 'Delhi',      budget: 12000, travelers: { count: 1, type: 'solo'    }, status: 'completed', title: 'Business Trip Delhi' },
  { source: 'Jaipur',    destination: 'Bangalore',  budget: 30000, travelers: { count: 2, type: 'couple'  }, status: 'planned',   title: 'Garden City Getaway' },
  { source: 'Delhi',     destination: 'Udaipur',    budget: 40000, travelers: { count: 4, type: 'family'  }, status: 'booked',    title: 'Lake City Family Tour' },
  { source: 'Mumbai',    destination: 'Chennai',    budget: 18000, travelers: { count: 2, type: 'friends' }, status: 'planned',   title: 'South India Exploration' },
  { source: 'Indore',    destination: 'Varanasi',   budget: 16000, travelers: { count: 1, type: 'solo'    }, status: 'planned',   title: 'Solo Spiritual Quest' },
  { source: 'Bhopal',    destination: 'Goa',        budget: 32000, travelers: { count: 5, type: 'friends' }, status: 'booked',    title: 'Bhopal Crew in Goa 🌊' },
  { source: 'Pune',      destination: 'Jaipur',     budget: 24000, travelers: { count: 2, type: 'couple'  }, status: 'completed', title: 'Desert Rose Trip 🌹' },
]

async function seed() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Hotel.deleteMany({}),
      Trip.deleteMany({}),
      Wishlist.deleteMany({}),
      Review.deleteMany({}),
    ])
    console.log('🗑️  Cleared existing data')

    // Seed Hotels
    const hotels = await Hotel.insertMany(HOTELS)
    console.log(`🏨  Seeded ${hotels.length} hotels`)

    // Seed Users (hash passwords)
    const hashedUsers = await Promise.all(
      USERS_RAW.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 12),
      }))
    )
    const users = await User.insertMany(hashedUsers)
    console.log(`👤  Seeded ${users.length} users`)

    // Create wishlists for each user
    await Wishlist.insertMany(
      users.map((u, i) => ({
        user: u._id,
        hotels: hotels.slice(i % 5, (i % 5) + 3).map((h) => h._id),
        destinations: [
          { name: 'Paris', emoji: '🗼' },
          { name: 'Bali', emoji: '🏝️' },
        ],
      }))
    )
    console.log('💝  Seeded wishlists')

    // Seed Trips (assign to users round-robin, add start/end dates, hotels, itinerary)
    const { generateItinerary } = require('./itineraryGenerator')
    const tripDocs = TRIPS_RAW.map((t, i) => {
      const userId = users[i % users.length]._id
      const start = new Date(Date.now() + (i + 1) * 7 * 86400000) // staggered future dates
      const end   = new Date(start.getTime() + 3 * 86400000)
      const itinerary = generateItinerary({ destination: t.destination, source: t.source, startDate: start, endDate: end, budget: t.budget, travelers: t.travelers })

      return {
        ...t,
        user: userId,
        startDate: start,
        endDate: end,
        hotels: [hotels[i % hotels.length]._id],
        itinerary,
        totalCost: t.budget,
        transport: [
          {
            mode: 'flight',
            from: t.source,
            to: t.destination,
            departureTime: '08:00',
            arrivalTime: '10:30',
            duration: '2h 30m',
            price: Math.floor(t.budget * 0.25),
            operator: 'IndiGo',
            class: 'Economy',
          },
        ],
      }
    })

    const trips = await Trip.insertMany(tripDocs)
    console.log(`✈️   Seeded ${trips.length} trips`)

    // Update users with their savedTrips references
    for (let i = 0; i < trips.length; i++) {
      const uid = users[i % users.length]._id
      await User.findByIdAndUpdate(uid, { $addToSet: { savedTrips: trips[i]._id } })
    }

    // Seed a few Reviews
    const reviews = []
    for (let i = 0; i < Math.min(users.length, hotels.length); i++) {
      reviews.push({
        user: users[i]._id,
        hotel: hotels[i]._id,
        rating: 4 + Math.round(Math.random()),
        comment: `Absolutely loved my stay at ${HOTELS[i].name}! The staff was welcoming, rooms were immaculate, and the overall experience was incredible. Would definitely visit again.`,
      })
    }
    await Review.insertMany(reviews)
    console.log(`⭐  Seeded ${reviews.length} reviews`)

    console.log('\n✅  Database seeded successfully!\n')
    console.log('📝  Test credentials (all passwords: password123):')
    USERS_RAW.forEach((u) => console.log(`   ${u.email}`))
    console.log()

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err)
    process.exit(1)
  }
}

seed()