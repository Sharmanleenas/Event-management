const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllRead,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.put("/read/:id", protect, markAsRead);
router.put("/mark-all-read", protect, markAllRead);

module.exports = router;
