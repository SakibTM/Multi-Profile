// backend/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a profile name'],
    trim: true,
    maxlength: [50, 'Profile name cannot exceed 50 characters']
  },
  group: {
    type: String,
    trim: true,
    maxlength: [50, 'Group name cannot exceed 50 characters']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  browserType: {
    type: String,
    enum: ['chrome', 'firefox'],
    default: 'chrome'
  },
  storageType: {
    type: String,
    enum: ['local', 'cloud'],
    default: 'local'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  // Fingerprint settings
  fingerprint: {
    userAgent: {
      type: String
    },
    platform: {
      type: String
    },
    language: {
      type: String,
      default: 'en-US'
    },
    screenResolution: {
      type: String,
      default: '1920x1080'
    },
    timezone: {
      type: String,
      default: 'America/New_York'
    },
    webRTC: {
      mode: {
        type: String,
        enum: ['default', 'disabled', 'custom'],
        default: 'default'
      },
      publicIP: {
        type: String
      },
      localIPs: {
        type: [String],
        default: []
      }
    },
  },
  // Proxy settings
  proxy: {
    enabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['http', 'https', 'socks4', 'socks5'],
      default: 'http'
    },
    host: {
      type: String
    },
    port: {
      type: Number
    },
    username: {
      type: String
    },
    password: {
      type: String
    }
  },
  // Advanced settings
  headless: {
    type: Boolean,
    default: false
  },
  launchArgs: {
    type: [String],
    default: []
  },
  // Profile data storage path
  storagePath: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);