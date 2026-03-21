const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
  try {
    console.log("📨 REGISTRATION REQUEST RECEIVED");
    console.log("Body:", req.body);

    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email
          ? "Email already registered"
          : "Phone number already registered",
      });
    }

    await OTP.deleteMany({ email });

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({
      email,
      otp,
      expiresAt: otpExpire,
      userData: { name, phone, password, role },
    });

    console.log("═══════════════════════════════════════");
    console.log("🔑 OTP for", email, ":", otp);
    console.log("═══════════════════════════════════════");

    res.status(200).json({
      success: true,
      message: "OTP sent to your email (check terminal for development)",
      email,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration error",
      error: error.message,
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (new Date(otpRecord.expiresAt) < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please register again.",
      });
    }

    const { name, phone, password, role } = otpRecord.userData;

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      isVerified: true,
    });

    console.log("✅ User created successfully:", user._id, user.email);

    await OTP.deleteOne({ _id: otpRecord._id });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login error",
      error: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};