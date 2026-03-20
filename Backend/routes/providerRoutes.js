const express = require("express");
const {
  createProviderProfile,
  getProviderProfile,
  updateProviderProfile,
  getAllProviders,
  getNearbyProviders,
  deleteProviderProfile,
} = require("../controllers/providerController");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

router.post("/create", authenticate, authorize("provider"), createProviderProfile);
router.get("/:id", getProviderProfile);
router.put("/update", authenticate, authorize("provider"), updateProviderProfile);
router.get("/", getAllProviders);
router.post("/nearby", getNearbyProviders);
router.delete("/:id", authenticate, authorize("admin"), deleteProviderProfile);

module.exports = router;
