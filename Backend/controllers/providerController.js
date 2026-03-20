const Provider = require("../models/Provider");
const User = require("../models/User");

// Create provider profile
exports.createProviderProfile = async (req, res) => {
  try {
    const { serviceCategory, experience, bio, hourlyRate, skills, certifications } = req.body;

    // Check if provider profile already exists
    const existingProvider = await Provider.findOne({ userId: req.userId });

    if (existingProvider) {
      return res.status(409).json({
        success: false,
        message: "Provider profile already exists",
      });
    }

    const provider = await Provider.create({
      userId: req.userId,
      serviceCategory,
      experience,
      bio,
      hourlyRate,
      skills: skills || [],
      certifications: certifications || [],
    });

    res.status(201).json({
      success: true,
      message: "Provider profile created successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating provider profile",
      error: error.message,
    });
  }
};

// Get provider profile
exports.getProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate("userId", "name email phone");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    res.status(200).json({
      success: true,
      provider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching provider profile",
      error: error.message,
    });
  }
};

// Update provider profile
exports.updateProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOneAndUpdate({ userId: req.userId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Provider profile updated successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating provider profile",
      error: error.message,
    });
  }
};

// Get all providers (with filters)
exports.getAllProviders = async (req, res) => {
  try {
    const { serviceCategory, city, minRating } = req.query;

    let filter = { verified: true, availability: true };

    if (serviceCategory) {
      filter.serviceCategory = serviceCategory;
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    const providers = await Provider.find(filter)
      .populate("userId", "name email phone city address")
      .limit(20);

    res.status(200).json({
      success: true,
      count: providers.length,
      providers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching providers",
      error: error.message,
    });
  }
};

// Find nearby providers
exports.getNearbyProviders = async (req, res) => {
  try {
    const { latitude, longitude, serviceCategory, distance } = req.body;

    const maxDistance = (distance || 10) * 1000; // convert km to meters

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const providers = await Provider.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
      ...(serviceCategory && { serviceCategory }),
      availability: true,
      verified: true,
    }).populate("userId", "name email phone");

    res.status(200).json({
      success: true,
      count: providers.length,
      providers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error finding nearby providers",
      error: error.message,
    });
  }
};

// Delete provider profile
exports.deleteProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Provider profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting provider profile",
      error: error.message,
    });
  }
};
