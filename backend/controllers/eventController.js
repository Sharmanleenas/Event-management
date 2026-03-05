const Event = require("../models/Event");
const Participant = require("../models/Participant");

exports.createEvent = async (req, res) => {
  try {

    // Role check
    console.log(req.user);
    if (req.user.role !== "HOD" && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only HOD and ADMIN can create events" });
    }

    const { title, description, upiId, amount, participantIdPrefix } = req.body;

    const event = await Event.create({
      title,
      description,
      department: req.user.department,
      createdBy: req.user._id,
      upiId,
      amount,
      participantIdPrefix,
      status: "PENDING",
    });

    res.status(201).json(event);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "PENDING" });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.status = "APPROVED";
    await event.save();
    res.json({ message: "Event Approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.status = "REJECTED";
    await event.save();
    res.json({ message: "Event Rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "APPROVED" });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markEventCompleted = async (req, res) => {
  try {
    console.log(req.user);
    if (req.user.role !== "ADMIN" && req.user.role !== "HOD") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.status = "COMPLETED";
    await event.save();
    res.json({ message: "Event marked as completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
