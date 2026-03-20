const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);
router.get("/all", authenticate, authorize("admin"), getAllUsers);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);

module.exports = router;
