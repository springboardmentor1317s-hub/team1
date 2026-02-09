require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectToDb = require('./db/db');

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

// TTS & Voice Assistant routes
const ttsRoute = require('./routes/tts');
const askRoutes = require('./routes/ask');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// TTS & Voice Assistant
app.use('/api/tts', ttsRoute);
app.use('/api/ask', askRoutes);

// Connect to Database
connectToDb();

// API Routes
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

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
