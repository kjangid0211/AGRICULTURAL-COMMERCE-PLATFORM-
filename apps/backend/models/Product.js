const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    default: '',
  },
  specifications: [{
    label: String,
    value: String
  }],
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  b2bVisibility: {
    type: Boolean,
    default: true,
  },
  b2cVisibility: {
    type: Boolean,
    default: true,
  },
  minOrderQty: {
    type: Number,
    default: 1,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
