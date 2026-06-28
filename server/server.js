require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve project images as static files
app.use('/projects', express.static(path.join(__dirname, '../client/projects')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB_NAME || 'Centuries',
  serverSelectionTimeoutMS: 10000,
})
  .then(() => console.log('✅ MongoDB connected to', process.env.DB_NAME))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Routes
app.use('/api/leads', require('./routes/leads'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/projects', require('./routes/projects'));

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  db: mongoose.connection.readyState,
  dbStates: { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }[mongoose.connection.readyState],
  mongoUri: process.env.MONGODB_URI ? '✅ loaded' : '❌ NOT LOADED — check .env path',
}));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
