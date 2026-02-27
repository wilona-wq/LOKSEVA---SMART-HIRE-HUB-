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
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// ── SERVE FRONTEND FILES from /public ──
app.use(express.static(path.join(__dirname, 'public')));

// ── CONNECT MONGODB ──
// Note: useNewUrlParser and useUnifiedTopology removed
// They are not supported in newer versions of Mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// ── ROUTES ──
app.use('/auth',    require('./routes/auth'));
app.use('/booking', require('./routes/booking'));
app.use('/review',  require('./routes/review'));

// ── START SERVER ──
app.listen(process.env.PORT, () => {
  console.log(`🚀 Lokseva running at http://localhost:${process.env.PORT}`);
});
