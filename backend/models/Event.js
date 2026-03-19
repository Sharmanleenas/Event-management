const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    department: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upiId: String,
    feeAmount: { type: Number, default: 0 },
    maxGamesPerParticipant: { type: Number, default: 3 },
    games: [
      {
        name: String,
        rules: String,
        participantLimit: Number,
        category: { type: String, default: "Technical" },
        currentRegistrations: { type: Number, default: 0 }
      }
    ],
    participantIdPrefix: String,
    date: { type: Date, default: Date.now },
    venue: { type: String, default: 'TBD' },
    isRegistrationOpen: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },
    parentEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    rules: {
      type: [String],
      default: [],
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
