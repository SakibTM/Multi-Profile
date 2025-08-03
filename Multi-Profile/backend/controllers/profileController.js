// backend/controllers/profileController.js
const Profile = require('../models/Profile');
const User = require('../models/User');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

// @desc    Get all profiles for a user
// @route   GET /api/profiles
// @access  Private
exports.getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single profile
// @route   GET /api/profiles/:id
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Make sure user owns profile
    if (profile.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this profile'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new profile
// @route   POST /api/profiles
// @access  Private
exports.createProfile = async (req, res, next) => {
  try {
    // Check if user has reached profile limit
    const user = await User.findById(req.user.id);
    const currentProfileCount = await Profile.countDocuments({ userId: req.user.id });
    
    if (!user.unlimitedProfiles && currentProfileCount >= user.profileLimit) {
      return res.status(400).json({
        success: false,
        message: 'You have reached your profile limit'
      });
    }

    // Add user ID to req.body
    req.body.userId = req.user.id;

    // Create profile directory
    const profileId = uuidv4();
    const profileDir = path.join(config.profileStoragePath, profileId);
    
    await fs.ensureDir(profileDir);
    
    // Add storage path to profile data
    req.body.storagePath = profileDir;

    const profile = await Profile.create(req.body);

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Make sure user owns profile
    if (profile.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    // Don't allow updating userId
    delete req.body.userId;
    // Don't allow updating storagePath
    delete req.body.storagePath;

    profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete profile
// @route   DELETE /api/profiles/:id
// @access  Private
exports.deleteProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Make sure user owns profile
    if (profile.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this profile'
      });
    }

    // Remove profile directory
    if (profile.storagePath) {
      await fs.remove(profile.storagePath);
    }

    await profile.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Launch profile
// @route   POST /api/profiles/:id/launch
// @access  Private
exports.launchProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Make sure user owns profile
    if (profile.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to launch this profile'
      });
    }

    // Here you would implement the actual browser launching logic
    // This is a simplified example using Puppeteer
    
    const browserType = profile.browserType;
    const headless = profile.headless;
    const proxy = profile.proxy.enabled ? 
      `${profile.proxy.type}://${profile.proxy.username}:${profile.proxy.password}@${profile.proxy.host}:${profile.proxy.port}` : 
      null;
    
    // In a real implementation, you would spawn a separate process to handle the browser
    // For now, we'll just return a success response
    
    res.status(200).json({
      success: true,
      message: 'Profile launched successfully',
      data: {
        profileId: profile._id,
        browserType,
        headless,
        proxy: proxy ? 'Enabled' : 'Disabled'
      }
    });
  } catch (error) {
    next(error);
  }
};