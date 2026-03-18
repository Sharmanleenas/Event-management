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
    amount: Number,
    participantIdPrefix: String,
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
