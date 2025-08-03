// backend/server.js
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});