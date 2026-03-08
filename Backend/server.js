const express  = require('express');
const session  = require('express-session');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config();

// sanity checks
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI not defined in .env');
  process.exit(1);
}
if (!process.env.SESSION_SECRET) {
  console.warn('Warning: SESSION_SECRET not set, using default (not secure)');
  process.env.SESSION_SECRET = 'default_secret';
}

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

// ── SERVE FRONTEND FILES from /public (and keep backward compatibility with Frontend folder)
app.use(express.static(path.join(__dirname, 'public')));
// some developers edit files in the separate Frontend/ directory; serve those too so changes
// are reflected without confusion. express.static stops searching after the first match.
app.use(express.static(path.join(__dirname, '../Frontend')));

// ── CONNECT MONGODB ──
// Note: useNewUrlParser and useUnifiedTopology removed
// They are not supported in newer versions of Mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ DB Error:', err);
    // exit process; app can't function without database
    process.exit(1);
  });

// ── ROUTES ──
app.use('/auth', require('./routes/auth'));

// simple auth middleware that checks for an active session
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  res.status(401).json({ success: false, message: 'Not logged in.' });
}

app.use('/booking', requireAuth, require('./routes/booking'));
app.use('/review',  requireAuth, require('./routes/review'));
// ── DEFAULT ROUTE ──
app.get('/', (req, res) => res.redirect('/index.html')); // landing page

// catch-all 404
app.use((req, res) => {
  res.status(404).send('Not found');
});

// ── GLOBAL ERROR HANDLER ──
// catch unhandled errors passed to next()
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── START SERVER ──
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Lokseva running at http://localhost:${port}`);
});
