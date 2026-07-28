require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const logger = require('./middleware/logger')
const { errorHandler, notFound } = require('./middleware/errorHandler')

// ── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB()

const app = express()

// ── Core Middleware ──────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://trip-mate-orpin.vercel.app",
  "https://trip-mate-f2m7eqsqf-nikhar-project.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(logger)

// ── Static: uploaded files ───────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TripMate API is running 🚀', timestamp: new Date().toISOString() })
})

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'))
app.use('/api/users',     require('./routes/users'))
app.use('/api/trips',     require('./routes/trips'))
app.use('/api/hotels',    require('./routes/hotels'))
app.use('/api/reviews',   require('./routes/reviews'))
app.use('/api/wishlist',  require('./routes/wishlist'))
app.use('/api/transport', require('./routes/transport'))

// ── 404 + Global Error Handler ───────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`\n🚀  TripMate backend running on http://localhost:${PORT}`)
  console.log(`📁  Uploads served at  http://localhost:${PORT}/uploads`)
  console.log(`❤️   Health check at    http://localhost:${PORT}/api/health\n`)
})