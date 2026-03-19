const express = require("express");
const router = express.Router();
const { submitContact, getMessages, markAsRead } = require("../controllers/contactController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public route
router.post("/submit", submitContact);

// Protected routes (Admin/HOD)
router.get("/", protect, authorizeRoles("ADMIN", "HOD"), getMessages);
router.put("/read/:id", protect, authorizeRoles("ADMIN", "HOD"), markAsRead);
router.post("/reply/:id", protect, authorizeRoles("ADMIN", "HOD"), require("../controllers/contactController").replyToContact);

module.exports = router;
