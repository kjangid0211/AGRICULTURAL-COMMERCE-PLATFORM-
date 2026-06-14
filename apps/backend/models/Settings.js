const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  websiteName: {
    type: String,
    required: true,
    default: 'AgriCommerce',
  },
  logoPlaceholder: {
    type: String,
    default: '🌾 AgriCommerce',
  },
  defaultMode: {
    type: String,
    enum: ['B2B', 'B2C'],
    default: 'B2C',
  },
  contactEmail: {
    type: String,
    default: 'contact@agricommerce.com',
  },
  contactPhone: {
    type: String,
    default: '+1 (555) 019-2834',
  },
  address: {
    type: String,
    default: '100 Green Fields Way, Agriculture Valley, CA 90210',
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
  themeDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      primaryColor: '#1e4620',
      secondaryColor: '#7a5c3e',
      backgroundColor: '#faf9f6',
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
