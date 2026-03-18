const Participant = require("../models/Participant");
const Event = require("../models/Event");

exports.getAnalytics = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments({ status: { $regex: /^approved$/i } });

    const totalParticipants = await Participant.countDocuments();

    const revenueData = await Participant.aggregate([
      { $match: { paymentStatus: { $regex: /^approved$/i } } },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$event.amount" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      totalEvents,
      totalParticipants,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
