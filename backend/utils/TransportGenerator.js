/**
 * Dummy transport generator — simulates flights, trains, buses
 * In production, replace with real API (Amadeus, IRCTC, RedBus, etc.)
 */

const OPERATORS = {
  flight: ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'Go First', 'AirAsia India'],
  train: ['Rajdhani Express', 'Shatabdi Express', 'Duronto Express', 'Vande Bharat', 'Garib Rath', 'Jan Shatabdi'],
  bus: ['Volvo AC Sleeper', 'MSRTC', 'KSRTC', 'RedBus Premium', 'Greenline Tours', 'Orange Travels'],
}

const CLASSES = {
  flight: ['Economy', 'Business', 'First Class'],
  train: ['Sleeper', '3A', '2A', '1A', 'CC'],
  bus: ['Seater', 'Semi-Sleeper', 'Sleeper', 'Volvo AC'],
}

const BASE_PRICES = {
  flight: { min: 2500, max: 15000 },
  train: { min: 300, max: 3000 },
  bus: { min: 250, max: 2000 },
}

const DURATIONS = {
  flight: ['1h 10m', '1h 30m', '2h 00m', '2h 30m', '3h 00m'],
  train: ['4h 00m', '5h 30m', '6h 00m', '8h 00m', '10h 30m', '12h 00m'],
  bus: ['5h 00m', '7h 30m', '9h 00m', '10h 00m', '12h 00m'],
}

const DEPARTURE_TIMES = [
  '05:30', '06:00', '07:15', '08:00', '09:30', '10:45',
  '12:00', '13:30', '15:00', '16:45', '18:00', '19:30', '21:00', '22:30',
]

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function addMinutes(timeStr, minutes) {
  const [h, m] = timeStr.split(':').map(Number)
  const total = h * 60 + m + minutes
  const nh = Math.floor(total / 60) % 24
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

function durationToMinutes(durationStr) {
  const match = durationStr.match(/(\d+)h\s+(\d+)m/)
  if (!match) return 120
  return parseInt(match[1]) * 60 + parseInt(match[2])
}

function generateOptions(from, to, mode, count = 4) {
  const options = []

  for (let i = 0; i < count; i++) {
    const departure = randomFrom(DEPARTURE_TIMES)
    const duration = randomFrom(DURATIONS[mode])
    const arrival = addMinutes(departure, durationToMinutes(duration))
    const { min, max } = BASE_PRICES[mode]
    const price = Math.floor(min + Math.random() * (max - min))
    const cls = randomFrom(CLASSES[mode])
    const operator = randomFrom(OPERATORS[mode])

    options.push({
      id: `${mode}_${i + 1}_${Date.now()}`,
      mode,
      from,
      to,
      operator,
      class: cls,
      departureTime: departure,
      arrivalTime: arrival,
      duration,
      price,
      seatsAvailable: Math.floor(10 + Math.random() * 50),
    })
  }

  // Sort by price
  return options.sort((a, b) => a.price - b.price)
}

function getTransportOptions(from, to) {
  return {
    flights: generateOptions(from, to, 'flight', 4),
    trains: generateOptions(from, to, 'train', 5),
    buses: generateOptions(from, to, 'bus', 4),
  }
}

module.exports = { getTransportOptions }