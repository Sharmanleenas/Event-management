const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    participantId: String,
    name: String,
    email: String,
    phone: String,
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    registerNumber: String,
    department: String,
    college: { type: String, default: "Sacred Heart College" },
    selectedGames: [String],
    paymentScreenshot: String,
    paymentStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Participant", participantSchema);
