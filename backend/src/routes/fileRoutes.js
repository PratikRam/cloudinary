const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadFile, getFiles, deleteFile } = require('../controllers/FileController');

// Jab frontend se file upload ho (form-data banake, jisme key ka naam 'image' ho)
// POST: /api/images/upload
router.post('/upload', upload.single('file'), uploadFile);

// Jab grid ke liye saari photo fetch karni ho
// GET: /api/images
router.get('/', getFiles);

// Delete karne ke liye route parameters mein uska mongo ID bhejenge
// DELETE: /api/images/:id
router.delete('/:id', deleteFile);

module.exports = router;
