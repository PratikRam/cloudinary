const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { connectCloudinary } = require('./src/config/cloudinary');

// Load environment variables (.env file)
dotenv.config();

// Connect to Database and Cloudinary
connectDB();
connectCloudinary();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  

// API Routes
app.use('/api/files', require('./src/routes/fileRoutes'));

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Image Drive API is running successfully!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
