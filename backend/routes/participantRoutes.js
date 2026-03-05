const express = require("express");
const router = express.Router();
const {
  registerParticipant,
  uploadPaymentProof,
} = require("../controllers/participantController");
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
  upload.single("payment"),
  uploadPaymentProof
);

module.exports = router;
