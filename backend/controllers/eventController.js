const Event = require("../models/Event");
const Participant = require("../models/Participant");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.createEvent = async (req, res) => {
  try {
    const userRole = req.user.role?.toUpperCase();
    if (userRole !== "HOD" && userRole !== "ADMIN" && userRole !== "LEADER") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const { title, description, upiId, amount, participantIdPrefix, rules, parentEvent } = req.body;

    const event = await Event.create({
      title,
      description,
      department: req.user.department,
      createdBy: req.user._id,
      upiId,
      amount: amount || 0,
      participantIdPrefix,
      status: userRole === "ADMIN" ? "APPROVED" : "PENDING",
      rules,
      parentEvent
    });

    if (userRole !== "ADMIN" && !parentEvent) {
      const admins = await User.find({ role: { $regex: /^admin$/i } });
      const notifications = admins.map((admin) => ({
        userId: admin._id,
        title: "New Event Request",
        message: `${req.user.department} department submitted "${title}" for approval.`,
      }));
      await Notification.insertMany(notifications);
      console.log(`Created ${notifications.length} notifications for admins.`);
    }

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only creator or Admin can update
    const userRole = req.user.role?.toUpperCase();
    if (event.createdBy.toString() !== req.user._id.toString() && userRole !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Event.findByIdAndDelete(req.params.id);
    // Also delete sub-events if any
    await Event.deleteMany({ parentEvent: req.params.id });
    
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("parentEvent", "title");
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    // Get sub-events
    const subEvents = await Event.find({ parentEvent: event._id });
    
    res.json({ ...event._doc, subEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: { $regex: /^pending$/i } }).populate("createdBy", "name department");
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
    
    if (event.createdBy) {
      await Notification.create({
        userId: event.createdBy,
        title: "Event Approved",
        message: `Your event "${event.title}" has been approved.`,
      });
    }

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

    if (event.createdBy) {
      await Notification.create({
        userId: event.createdBy,
        title: "Event Rejected",
        message: `Your event "${event.title}" was rejected.`,
      });
    }

    res.json({ message: "Event Rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: { $regex: /^approved$/i } });
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

exports.getEvents = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "HOD" || req.user.role === "LEADER") {
      query.department = req.user.department;
    }
    const events = await Event.find(query).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.comments.push({
      user: req.user._id,
      userName: req.user.name || req.user.email.split("@")[0],
      text,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addRule = async (req, res) => {
  try {
    const { rule } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.rules.push(rule);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
