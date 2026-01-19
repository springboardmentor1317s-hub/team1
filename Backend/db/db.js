const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        // Safety check – avoids "Invalid scheme" error
        if (!process.env.DB_CONNECT) {
            throw new Error('DB_CONNECT environment variable is missing');
        }

        if (
            !process.env.DB_CONNECT.startsWith('mongodb://') &&
            !process.env.DB_CONNECT.startsWith('mongodb+srv://')
        ) {
            throw new Error('Invalid MongoDB connection string format');
        }

        await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ MongoDB Atlas connected successfully');

        // Optional: Connection event logs (very useful)
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB runtime error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1); // Fail fast if DB is unavailable
    }
};

module.exports = connectToDb;

