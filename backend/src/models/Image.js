const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  originalFilename: {
    type: String,
  }
}, {
  timestamps: true // yeh apne aap createdAt aur updatedAt fields add kar dega
});

module.exports = mongoose.model('Image', imageSchema);
