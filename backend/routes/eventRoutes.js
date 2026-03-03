const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { createEvent } = require("../controllers/eventController");

router.post("/create", protect, authorizeRoles("HOD", "LEADER"), createEvent);

module.exports = router;
