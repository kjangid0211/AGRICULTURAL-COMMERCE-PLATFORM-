const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  enquiryType: {
    type: String,
    enum: ['product', 'bulk', 'general'],
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  companyName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'completed'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', EnquirySchema);
