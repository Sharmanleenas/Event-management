const express = require("express");
const router = express.Router();
const {
  registerParticipant,
  uploadPaymentProof,
  getPendingVerifications,
  verifyPayment,
  getParticipantsByEvent,
} = require("../controllers/participantController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/register", registerParticipant);

router.post(
  "/upload/:id",
  upload.any(),
  uploadPaymentProof
);

router.get("/verify", protect, authorizeRoles("LEADER", "HOD", "ADMIN"), getPendingVerifications);
router.put("/verify/:id", protect, authorizeRoles("LEADER", "HOD", "ADMIN"), verifyPayment);
router.get("/event/:id", protect, authorizeRoles("HOD", "ADMIN"), getParticipantsByEvent);

module.exports = router;
