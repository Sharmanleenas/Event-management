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
    internalPrice: { type: Number, default: 0 },
    externalPrice: { type: Number, default: 0 },
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
    // Staff Portal Fields
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    staffStatus: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED"], default: "PENDING" },
    duration: { type: String, default: "" },
    staffNotes: { type: String, default: "" },
    documents: {
      invitation: { type: String, default: "" },
      profile: { type: String, default: "" },
      attendance: { type: String, default: "" },
      feedback: { type: String, default: "" },
      photos: { type: [String], default: [] }
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
