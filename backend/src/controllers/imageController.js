const Image = require('../models/Image');
const { cloudinary } = require('../config/cloudinary');

// 1. Upload Image Controller
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Image buffer ko data URI format mein convert karna jise Cloudinary samajh sake
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Cloudinary server pe image upload karna
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'image-app', // yeh is naam ka folder automatically Cloudinary mein bana dega
      resource_type: 'auto',
    });

    // Cloudinary se link milne ke baad DB mein uski info save karna
    const newImage = new Image({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      originalFilename: req.file.originalname,
    });

    await newImage.save();

    res.status(201).json({
      message: 'Image uploaded successfully!',
      image: newImage
    });

  } catch (error) {
    console.error('Error in uploadImage:', error);
    res.status(500).json({ message: 'Server error during image upload' });
  }
};

// 2. Fetch All Images Controller
const getImages = async (req, res) => {
  try {
    // Database se images dhundhna aur naye se purane (descending order) mein sort karna
    const images = await Image.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    console.error('Error in getImages:', error);
    res.status(500).json({ message: 'Server error while fetching images' });
  }
};

// 3. Delete Image Controller
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Sabse pehle image DB mein khojna (uske ID se)
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found in database' });
    }

    // Image ka `publicId` use karke Cloudinary se delete karna
    await cloudinary.uploader.destroy(image.publicId);

    // Fir MongoDB database se delete karna
    await image.deleteOne();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error in deleteImage:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

module.exports = {
  uploadImage,
  getImages,
  deleteImage
};
