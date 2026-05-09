/**
 * Dummy AI itinerary generator
 * Produces a day-by-day travel plan based on destination, duration, and budget
 */

const CITY_ATTRACTIONS = {
  delhi: ['India Gate', 'Red Fort', 'Qutub Minar', 'Lotus Temple', 'Humayun Tomb', 'Chandni Chowk'],
  mumbai: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Juhu Beach', 'Colaba Causeway', 'Dharavi'],
  jaipur: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Johari Bazaar'],
  goa: ['Baga Beach', 'Calangute Beach', 'Fort Aguada', 'Basilica of Bom Jesus', 'Anjuna Flea Market'],
  bangalore: ['Lalbagh Botanical Garden', 'Cubbon Park', 'ISKCON Temple', 'Vidhana Soudha', 'UB City Mall'],
  hyderabad: ['Charminar', 'Golconda Fort', 'Hussain Sagar Lake', 'Salar Jung Museum', 'Birla Temple'],
  kolkata: ['Victoria Memorial', 'Howrah Bridge', 'Park Street', 'Dakshineswar Kali Temple', 'Eden Gardens'],
  chennai: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St. George', 'Mahabalipuram', 'Elliots Beach'],
  varanasi: ['Kashi Vishwanath Temple', 'Ganga Aarti', 'Sarnath', 'Dashashwamedh Ghat', 'Ramnagar Fort'],
  udaipur: ['City Palace', 'Lake Pichola', 'Sajjangarh Palace', 'Saheliyon Ki Bari', 'Jagdish Temple'],
  agra: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh', 'Tomb of Itimad-ud-Daulah'],
  indore: ['Rajwada Palace', 'Sarafa Bazaar', 'Patalpani Waterfall', 'Ralamandal Wildlife Sanctuary'],
  pune: ['Shaniwar Wada', 'Sinhagad Fort', 'Aga Khan Palace', 'Osho Ashram', 'Pashan Lake'],
  ahmedabad: ['Sabarmati Ashram', 'Kankaria Lake', 'Adalaj Stepwell', 'Law Garden', 'Sidi Saiyad Mosque'],
  bhopal: ['Upper Lake', 'Van Vihar', 'Bharat Bhavan', 'Rock Shelters of Bhimbetka', 'Taj-ul-Masjid'],
}

const CITY_FOOD = {
  delhi: ['Butter Chicken at Moti Mahal', 'Chhole Bhature at Sitaram', 'Parathas at Paranthe Wali Gali', 'Chaat at Chandni Chowk'],
  mumbai: ['Vada Pav at Anand Stall', 'Pav Bhaji at Juhu Beach', 'Seafood at Trishna', 'Chai at Irani Café'],
  jaipur: ['Dal Baati Churma at Chokhi Dhani', 'Ghewar at local sweet shops', 'Laal Maas at Suvarna Mahal'],
  goa: ['Goan Fish Curry at Fisherman\'s Wharf', 'Bebinca Dessert', 'Feni cocktails at Beach Shacks'],
  bangalore: ['Filter Coffee at Brahmin\'s Coffee Bar', 'Masala Dosa at MTR', 'Biryani at Meghana Foods'],
  hyderabad: ['Hyderabadi Biryani at Paradise', 'Haleem at Shah Ghouse', 'Irani Chai at Nimrah Café'],
  varanasi: ['Malaiyo at Godowlia', 'Baati Chokha at Kashi Chat Bhandar', 'Thandai at Blue Lassi Shop'],
  default: ['Local breakfast at a traditional restaurant', 'Street food exploration', 'Regional dinner at a popular local spot'],
}

const TRANSPORT_TIMES = ['06:00 AM', '07:30 AM', '09:00 AM', '10:15 AM', '12:30 PM', '02:00 PM', '04:30 PM', '06:00 PM', '08:00 PM']

function getAttractions(city) {
  const key = city.toLowerCase()
  return CITY_ATTRACTIONS[key] || [
    `${city} Main Monument`,
    `${city} Local Market`,
    `${city} Heritage Walk`,
    `${city} Viewpoint`,
    `${city} Cultural Center`,
  ]
}

function getFoods(city) {
  const key = city.toLowerCase()
  return CITY_FOOD[key] || CITY_FOOD.default
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function generateItinerary({ destination, source, startDate, endDate, budget, travelers }) {
  const start = startDate ? new Date(startDate) : new Date()
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 2 * 86400000)
  const days = Math.max(1, Math.ceil((end - start) / 86400000))
  const dailyBudget = budget ? Math.floor(budget / days) : 3000

  const attractions = shuffle(getAttractions(destination))
  const foods = shuffle(getFoods(destination))

  const itinerary = []

  for (let d = 0; d < days; d++) {
    const date = new Date(start.getTime() + d * 86400000)
    const dateStr = date.toDateString()
    const attrsForDay = attractions.slice(d * 2, d * 2 + 2)
    const foodForDay = foods[d % foods.length]

    const activities = []

    if (d === 0) {
      activities.push({
        time: '09:00 AM',
        activity: `Arrive at ${destination} — Check-in at hotel, freshen up`,
        type: 'hotel',
        cost: Math.floor(dailyBudget * 0.4),
      })
    } else {
      activities.push({
        time: '08:00 AM',
        activity: 'Breakfast at hotel / local café',
        type: 'food',
        cost: Math.floor(150 + Math.random() * 200),
      })
    }

    if (attrsForDay[0]) {
      activities.push({
        time: '10:00 AM',
        activity: `Visit ${attrsForDay[0]}`,
        type: 'place',
        cost: Math.floor(200 + Math.random() * 600),
      })
    }

    activities.push({
      time: '01:00 PM',
      activity: foodForDay,
      type: 'food',
      cost: Math.floor(300 + Math.random() * 500),
    })

    if (attrsForDay[1]) {
      activities.push({
        time: '03:00 PM',
        activity: `Explore ${attrsForDay[1]}`,
        type: 'place',
        cost: Math.floor(100 + Math.random() * 400),
      })
    }

    activities.push({
      time: '07:00 PM',
      activity: 'Dinner at a popular local restaurant',
      type: 'food',
      cost: Math.floor(400 + Math.random() * 600),
    })

    if (d === days - 1) {
      activities.push({
        time: '10:00 AM',
        activity: `Check-out and depart to ${source || 'home'}`,
        type: 'transport',
        cost: 0,
      })
    }

    itinerary.push({
      day: d + 1,
      title: d === 0 ? `Arrival Day — Welcome to ${destination}` : d === days - 1 ? `Departure Day` : `Day ${d + 1} — Exploring ${destination}`,
      date: dateStr,
      activities,
    })
  }

  return itinerary
}

module.exports = { generateItinerary }