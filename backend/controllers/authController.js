const User = require('../models/User')
const Wishlist = require('../models/Wishlist')
const { sendTokenResponse } = require('../utils/jwt')

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    console.log("STEP 1");

    const user = new User({
      name,
      email,
      phone,
      password,
    });

    console.log("STEP 2");

    await user.save();

    console.log("STEP 3");

    sendTokenResponse(user, 201, res);

  } catch (err) {
    console.log(err);
    next(err);
  }
};
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email.' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' })
    }

    sendTokenResponse(user, 200, res)
  } catch (err) {
    next(err)
  }
}

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedTrips').populate('wishlist')
    res.status(200).json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

// @desc    Logout (client-side token removal, but we confirm server-side)
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' })
}

module.exports = { register, login, getMe, logout }