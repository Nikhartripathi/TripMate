const path = require('path')
const User = require('../models/User')

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({ path: 'savedTrips', select: 'title destination startDate endDate status totalCost' })
    res.status(200).json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

// @desc    Update user profile (name, email, phone)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body

    // Check if new email is taken by another user
    if (email && email !== req.user.email) {
      const taken = await User.findOne({ email })
      if (taken) {
        return res.status(400).json({ success: false, message: 'That email is already in use.' })
      }
    }

    const updates = {}
    if (name)  updates.name  = name.trim()
    if (email) updates.email = email.trim().toLowerCase()
    if (phone !== undefined) updates.phone = phone.trim()

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

// @desc    Upload profile image
// @route   PUT /api/users/profile/image
// @access  Private
const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imageUrl },
      { new: true }
    )

    res.status(200).json({ success: true, profileImage: user.profileImage, user })
  } catch (err) {
    next(err)
  }
}

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Old and new passwords are required.' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' })
    }

    const user = await User.findById(req.user.id).select('+password')
    const isMatch = await user.matchPassword(oldPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' })
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({ success: true, message: 'Password updated successfully.' })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id)
    res.status(200).json({ success: true, message: 'Account deleted successfully.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProfile, updateProfile, uploadProfileImage, changePassword, deleteAccount }