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

    const pendingApprovals = await Event.countDocuments({ status: { $regex: /^pending$/i } });

    const deptStats = await Event.aggregate([
      { $match: { status: { $regex: /^approved$/i } } },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const maxCount = deptStats.length > 0 ? Math.max(...deptStats.map(d => d.count)) : 0;

    res.json({
      totalEvents,
      totalParticipants,
      totalRevenue,
      pendingApprovals,
      deptStats,
      maxCount,
    });
  } catch (error) {
    require('fs').appendFileSync('server.log', `${new Date().toISOString()} - Analytics Error: ${error.message}\n`);
    res.status(500).json({ message: error.message });
  }
};

exports.getDepartmentAnalytics = async (req, res) => {
  try {
    const deptStats = await Event.aggregate([
      {
        $group: {
          _id: "$department",
          eventCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "participants",
          let: { dept: "$_id" },
          pipeline: [
            {
              $lookup: {
                from: "events",
                localField: "eventId",
                foreignField: "_id",
                as: "evt",
              },
            },
            { $unwind: "$evt" },
            { $match: { $expr: { $eq: ["$evt.department", "$$dept"] } } },
          ],
          as: "participants",
        },
      },
      {
        $project: {
          name: "$_id",
          eventCount: 1,
          participantCount: { $size: "$participants" },
          _id: 0,
        },
      },
    ]);

    res.json(deptStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaderAnalytics = async (req, res) => {
  try {
    const event = await Event.findOne({ department: req.user.department }).sort({ createdAt: -1 });
    if (!event) {
      return res.json({
        eventName: "No Event Assigned",
        totalGames: 0,
        totalRegistrations: 0,
        pendingVerification: 0,
        gameStats: []
      });
    }

    const totalParticipants = await Participant.countDocuments({ eventId: event._id });
    const pendingVerification = await Participant.countDocuments({ 
      eventId: event._id, 
      paymentStatus: "PENDING" 
    });
    const verifiedParticipants = await Participant.countDocuments({
      eventId: event._id,
      paymentStatus: "APPROVED"
    });

    const gameStats = (event.games || []).map(game => ({
      name: game.name,
      filled: game.currentRegistrations || 0,
      limit: game.participantLimit || 25
    }));

    res.json({
      eventId: event._id,
      eventName: event.title,
      totalGames: gameStats.length,
      totalParticipants,
      verifiedParticipants,
      pendingVerification,
      totalAmount: verifiedParticipants * (event.feeAmount || 0),
      gameStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
