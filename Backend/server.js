<<<<<<< HEAD
=======
require('dotenv').config();
const app = require('./app');
>>>>>>> 570f712 (feedback form is functional at both student as well as admin ends)




require('dotenv').config();          // Load environment variables
const mongoose = require('mongoose');
const app = require('./app');        // Import Express app from app.js

// Connect to MongoDB
const startDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.log('Error connecting to MongoDB:', err);
  }
};
startDb();

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
