const User = require("../models/User");

// Get user profile
exports.getUserProfile = async (req, res) => {
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
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    console.log("📨 UPDATE PROFILE REQUEST");
    console.log("User ID:", req.userId);
    console.log("Body:", req.body);
    
    const { name, phone, address, city, profileImage } = req.body;

    // Validation
    if (!name || !phone) {
      console.warn("❌ Missing required fields: name and phone");
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    console.log("✅ Validation passed");

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        phone,
        address,
        city,
        profileImage,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.warn("❌ User not found for ID:", req.userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User updated successfully:", user._id);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
