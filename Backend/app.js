<<<<<<< HEAD
require('dotenv').config(); // at the very top of the file
=======
require('dotenv').config();
>>>>>>> 570f712 (feedback form is functional at both student as well as admin ends)

const express = require('express');
const cors = require('cors');
const path = require('path');
<<<<<<< HEAD
const mongoose = require('mongoose');
=======
const connectToDb = require('./db/db');
>>>>>>> 570f712 (feedback form is functional at both student as well as admin ends)

// Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const userRoutes = require('./routes/userRoutes');
const systemHealthRoutes = require('./routes/systemHealthRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// TTS route
const ttsRoute = require('./routes/tts.js');

// ✅ Voice Assistant route (ask)
const askRoutes = require('./routes/ask'); // <-- Add this

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// ✅ TTS middleware
app.use('/api/tts', ttsRoute);

// ✅ Voice Assistant middleware
app.use('/api/ask', askRoutes); // <-- Add this

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to Database
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('Error connecting to MongoDB:', err));
=======
// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB
connectToDb();
>>>>>>> 570f712 (feedback form is functional at both student as well as admin ends)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/logs', activityLogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/system', systemHealthRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('🚀 CampusEventHub API is running');
});

// 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
