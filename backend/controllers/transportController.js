const { getTransportOptions } = require('../utils/TransportGenerator')

// @desc    Get transport options between two cities
// @route   GET /api/transport?from=Delhi&to=Mumbai
// @access  Private
const getTransport = async (req, res, next) => {
  try {
    const { from, to } = req.query
    if (!from || !to) {
      return res.status(400).json({ success: false, message: 'Both "from" and "to" query params are required.' })
    }

    const options = getTransportOptions(from, to)
    res.status(200).json({ success: true, from, to, options })
  } catch (err) {
    next(err)
  }
}

module.exports = { getTransport }