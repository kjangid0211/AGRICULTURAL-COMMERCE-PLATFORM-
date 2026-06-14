const mongoose = require('mongoose');

const CmsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('CMS', CmsSchema);
