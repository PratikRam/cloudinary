const fileModel = require('../models/file');
const { cloudinary } = require('../config/cloudinary');


const getFileType = (mimetype) => {
  if (mimetype.startsWith('image')) return 'image';
  if (mimetype.startsWith('video')) return 'video';
  return 'document';
};

// 1. Upload Image Controller
const uploadFile = async (req, res) => {
  // Helper function → file type detect

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Detect type
    const fileType = getFileType(req.file.mimetype);

    // Image buffer ko data URI format mein convert karna jise Cloudinary samajh sake
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Cloudinary server pe image upload karna
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `drive/${fileType}`, // yeh is naam ka folder automatically Cloudinary mein bana dega
      resource_type: 'auto',
    });

    // Cloudinary se link milne ke baad DB mein uski info save karna
    const newFile = new fileModel({
      fileUrl: result.secure_url,
      publicId: result.public_id,
      originalFilename: req.file.originalname,
      resourceType: req.file.mimetype
    });

    await newFile.save();

    res.status(201).json({
      message: 'File uploaded successfully!',
      file: newFile
    });

  } catch (error) {
    console.error('Error in uploadFile:', error);
    res.status(500).json({ message: 'Server error during Files upload' });
  }
};

// 2. Fetch All Images Controller
const getFiles = async (req, res) => {
  try {
    // Database se images dhundhna aur naye se purane (descending order) mein sort karna
    const Files = await fileModel.find().sort({ createdAt: -1 });
    res.status(200).json(Files);
  } catch (error) {
    console.error('Error in getFiles:', error);
    res.status(500).json({ message: 'Server error while fetching Files' });
  }
};

// 3. Delete Image Controller
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Sabse pehle image DB mein khojna (uske ID se)
    const file = await fileModel.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found in database' });
    }

    // Image ka `publicId` use karke Cloudinary se delete karna
    await cloudinary.uploader.destroy(file.publicId);

    // Fir MongoDB database se delete karna
    await file.deleteOne();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFile:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile
};
