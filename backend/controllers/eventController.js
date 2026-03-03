const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
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

  res.json(event);
};
