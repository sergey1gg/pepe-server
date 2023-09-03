const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const Product = new mongoose.Schema({
  name: String,
  cost: Number,
  shippingCost: Number,
  category: String,
  colors: [String],
  sizes: [String],
  images: [String],
  description: String,
  details: String,
  featured: Boolean,
  newsDrop: Boolean,
  count: Number,
  ostatok: Number
})
  module.exports = mongoose.model('Product', Product);
  