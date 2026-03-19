const User = require("../models/User");
const Event = require("../models/Event");

exports.getLeadersByDepartment = async (req, res) => {
  try {
    const department = req.user.department;
    const leaders = await User.find({ department, role: "LEADER" }).select("-password");
    
    const enhancedLeaders = await Promise.all(leaders.map(async (leader) => {
      const eventCount = await Event.countDocuments({ createdBy: leader._id });
      return { ...leader._doc, eventCount };
    }));

    res.json(enhancedLeaders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, department, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, department, role },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password").sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
