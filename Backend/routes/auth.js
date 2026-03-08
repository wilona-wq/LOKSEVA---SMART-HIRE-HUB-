const express    = require('express');
const router     = express.Router();
const bcrypt     = require('bcryptjs');
const nodemailer = require('nodemailer');
const User       = require('../models/User');
require('dotenv').config();

// ── EMAIL SETUP ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOTPEmail(toEmail, otp) {
  return transporter.sendMail({
    from: `"Lokseva" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Lokseva OTP Code',
    html: `
      <div style="font-family:Arial;max-width:400px;margin:auto;
                  padding:30px;border-radius:12px;
                  background:#f0f4f8;text-align:center;">
        <h2 style="color:#1a2757;">Lokseva 🛠️</h2>
        <p style="color:#607080;">Your OTP to verify your email:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:10px;
                    color:#1a2757;background:white;padding:20px;
                    border-radius:10px;margin:20px 0;">
          ${otp}
        </div>
        <p style="color:#b91c1c;font-size:13px;">
          Expires in <b>10 minutes</b>.
        </p>
      </div>
    `
  });
}

// ── REGISTER ──
router.post('/register', async (req, res) => {
  try {
    let { name, email, phone, password, role } = req.body;

    // normalize inputs early
    name  = (name || '').trim();
    email = (email || '').trim().toLowerCase();
    phone = (phone || '').trim();
    role  = (role || '').trim().toLowerCase();

    if (!name || !email || !phone || !password || !role)
      return res.json({ success: false, message: 'All fields are required.' });

    // only allow user/provider registration (admins are created manually)
    if (!['user', 'provider'].includes(role))
      return res.json({ success: false, message: 'Invalid role.' });

    if (!email.endsWith('@gmail.com'))
      return res.json({ success: false, message: 'Only @gmail.com emails allowed.' });

    if (!/^[0-9]{10}$/.test(phone))
      return res.json({ success: false, message: 'Phone must be 10 digits.' });

    if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?]/.test(password))
      return res.json({ success: false, message: 'Password needs 8+ chars, number & special char.' });

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified)
      return res.json({ success: false, message: 'Email already registered. Please login.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp            = generateOTP();
    const otpExpiry      = new Date(Date.now() + 10 * 60 * 1000);

    if (existing && !existing.isVerified) {
      existing.name = name;
      existing.password = hashedPassword;
      existing.otp  = otp;
      existing.otpExpiry = otpExpiry;
      await existing.save();
    } else {
      await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        otp,
        otpExpiry,
        isVerified: false,
        status: 'active'
      });
    }

    await sendOTPEmail(email, otp);
    res.json({ success: true, message: 'OTP sent to ' + email });

  } catch (err) {
    console.error('Register error:', err);
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ── VERIFY OTP ──
router.post('/verify-otp', async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = (email || '').trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user)                       return res.json({ success: false, message: 'User not found.' });
    if (new Date() > user.otpExpiry) return res.json({ success: false, message: 'OTP expired.' });
    if (user.otp !== otp)            return res.json({ success: false, message: 'Incorrect OTP.' });

    user.isVerified = true;
    user.otp        = null;
    user.otpExpiry  = null;
    await user.save();

    // Send role back so frontend redirects correctly
    res.json({ success: true, message: 'Email verified!', role: user.role });
  } catch (err) {
    res.json({ success: false, message: 'Server error.' });
  }
});

// ── RESEND OTP ──
router.post('/resend-otp', async (req, res) => {
  try {
    let { email } = req.body;
    email = (email || '').trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user)           return res.json({ success: false, message: 'Email not found.' });
    if (user.isVerified) return res.json({ success: false, message: 'Already verified.' });

    const otp = generateOTP();
    user.otp       = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, otp);
    res.json({ success: true, message: 'New OTP sent.' });
  } catch (err) {
    res.json({ success: false, message: 'Server error.' });
  }
});

// ── LOGIN ──
router.post('/login', async (req, res) => {
  try {
    let { email, password, role } = req.body;

    email = (email || '').trim().toLowerCase();
    role  = (role || '').trim().toLowerCase();

    if (!email || !password || !role)
      return res.json({ success: false, message: 'Email, password and role are required.' });

    if (!['user', 'provider'].includes(role))
      return res.json({ success: false, message: 'Invalid role for login.' });

    const user = await User.findOne({ email });
    if (!user)              return res.json({ success: false, message: 'Email not registered.' });
    if (user.role !== role) return res.json({ success: false, message: `No ${role} account found.` });
    if (!user.isVerified) {
      // automatically resend OTP when someone tries to log in without verification
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOTPEmail(user.email, otp);
      return res.json({ success: false,
        message: 'Please verify your email first. A new OTP has been sent to your Gmail.'
      });
    }
    if (user.status === 'blocked') return res.json({ success: false, message: 'Your account has been blocked. Contact admin.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Incorrect password.' });

    // login success - save session
    req.session.userId = user._id;
    req.session.role   = user.role;
    req.session.name   = user.name;

    res.json({ success: true, role: user.role, name: user.name, userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.json({ success: false, message: 'Server error.' });
  }
});

// ── LOGOUT ──
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/index.html');
  });
});

// ── CHECK SESSION ──
router.get('/me', (req, res) => {
  if (req.session.userId)
    res.json({ loggedIn: true, name: req.session.name, role: req.session.role, userId: req.session.userId });
  else
    res.json({ loggedIn: false });
});

// ── GET ALL USERS (Admin) ──
router.get('/all-users', async (req, res) => {
  try {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    const users = await User.find({}, 'name email role status isVerified createdAt');
    res.json({ success: true, users });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ── BLOCK / UNBLOCK USER (Admin) ──
router.put('/block/:userId', async (req, res) => {
  try {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
