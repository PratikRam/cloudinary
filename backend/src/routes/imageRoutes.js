const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage, getImages, deleteImage } = require('../controllers/imageController');

// Jab frontend se file upload ho (form-data banake, jisme key ka naam 'image' ho)
// POST: /api/images/upload
router.post('/upload', upload.single('image'), uploadImage);

// Jab grid ke liye saari photo fetch karni ho
// GET: /api/images
router.get('/', getImages);

// Delete karne ke liye route parameters mein uska mongo ID bhejenge
// DELETE: /api/images/:id
router.delete('/:id', deleteImage);

module.exports = router;
