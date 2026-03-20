const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register Controller
exports.register = async (req, res) => {
  try {
    console.log("📨 REGISTRATION REQUEST RECEIVED");
    console.log("Body:", req.body);
    
    const { name, email, phone, password, role } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !role) {
      console.log("❌ VALIDATION FAILED - Missing fields");
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    console.log("✅ Validation passed");
    console.log(`👤 Registering user: ${email} (${role})`);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(409).json({
        success: false,
        message: existingUser.email === email ? "Email already registered" : "Phone number already registered",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log("🔐 Generated OTP:", otp);

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      expiresAt: otpExpire,
    });

    console.log("✅ OTP Saved to database");

    // Store user data temporarily (will be saved after OTP verification)
    req.session = req.session || {};
    req.session.tempUser = { name, email, phone, password, role };

    console.log("✅ OTP Generated:", otp);
    console.log("═══════════════════════════════════════");
    console.log("USE THIS OTP TO VERIFY:", otp);
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

// Verify OTP Controller
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find and verify OTP
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if OTP expired
    if (otpRecord.expiresAt < Date.now()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please try again.",
      });
    }

    // Get temporary user data from session/request
    const tempUser = req.body.userData || req.session?.tempUser;

    if (!tempUser) {
      return res.status(400).json({
        success: false,
        message: "Registration data not found. Please register again.",
      });
    }

    console.log("📝 Creating user with data:", tempUser);

    // Create user
    const user = await User.create({
      name: tempUser.name,
      email,
      phone: tempUser.phone,
      password: tempUser.password,
      role: tempUser.role,
      isVerified: true,
    });

    console.log("✅ User created successfully:", user._id, user.email);

    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
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

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user and select password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
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

// Get current user
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
