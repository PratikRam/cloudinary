const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  originalFilename: {
    type: String,
  },
  resourceType: {
    type: String,
  }
}, {
  timestamps: true  // yeh apne aap createdAt aur updatedAt fields add kar dega
});

module.exports = mongoose.model('File', fileSchema);
