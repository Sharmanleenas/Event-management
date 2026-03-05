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
} = require("../controllers/eventController");

const { verifyPayment } = require("../controllers/participantController");

router.post("/create", protect, createEvent);

router.get("/pending", protect, authorizeRoles("ADMIN"), getPendingEvents);

router.get("/public", getApprovedEvents);

router.put("/approve/:id", protect, authorizeRoles("ADMIN"), approveEvent);

router.put("/reject/:id", protect, authorizeRoles("ADMIN"), rejectEvent);
router.put(
  "/verify/:id",
  protect,
  authorizeRoles("LEADER", "HOD"),
  verifyPayment,
);

router.put("/complete/:id", protect, markEventCompleted);

module.exports = router;
