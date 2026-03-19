const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createEvent,
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getApprovedEvents,
  markEventCompleted,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addComment,
  addRule,
  toggleRegistration,
} = require("../controllers/eventController");

const { verifyPayment } = require("../controllers/participantController");

// Public routes
router.get("/public", getApprovedEvents);
router.get("/details/:id", getEventById); // Use /details/:id to avoid any collision with /my-events

// Protected routes - General
router.post("/create", protect, createEvent);
router.get("/", protect, getEvents);
router.get("/my-events", protect, getEvents); // Dashboard list
router.post("/comment/:id", protect, addComment);
router.post("/rule/:id", protect, addRule);

// Protected routes - Management
router.put("/approve/:id", protect, authorizeRoles("ADMIN"), approveEvent);
router.put("/reject/:id", protect, authorizeRoles("ADMIN"), rejectEvent);
router.put("/toggle-registration/:id", protect, toggleRegistration);
router.put("/complete/:id", protect, markEventCompleted);

router.put("/verify/:id", protect, authorizeRoles("LEADER", "HOD"), verifyPayment);

// Standard CRUD (Put these at bottom)
router.get("/:id", getEventById); // Fallback for public details
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
