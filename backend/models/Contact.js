const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
    },
    message: {
      type: String,
      required: [true, "Please provide your message"],
    },
    status: {
      type: String,
      enum: ["UNREAD", "READ", "REPLIED"],
      default: "UNREAD",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
