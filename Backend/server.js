const express  = require('express');
const session  = require('express-session');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config();

const app = express();

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── SESSION ──
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// ── SERVE FRONTEND FILES ──
// This serves all your HTML files from the Public folder (note case)
app.use(express.static(path.join(__dirname, 'Public')));

// ── ROUTES ──
app.use('/auth', require('./routes/auth'));
app.use('/booking', require('./routes/booking'));
app.use('/review', require('./routes/review'));

// ── CONNECT MONGODB ──
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/lokseva';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// catch 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// ── START SERVER ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Lokseva running at http://localhost:${PORT}`);
});