const Event = require('../models/Event');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalAssigned = await Event.countDocuments({ assignedStaff: req.user._id });
    const pendingUploads = await Event.countDocuments({ assignedStaff: req.user._id, staffStatus: { $in: ['PENDING', 'IN_PROGRESS'] } });
    const completedTasks = await Event.countDocuments({ assignedStaff: req.user._id, staffStatus: 'COMPLETED' });

    res.json({
      assigned: totalAssigned,
      pendingUploads: pendingUploads,
      completed: completedTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

exports.getAssignedEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const eventsQuery = Event.find({ assignedStaff: req.user._id }).sort({ createdAt: -1 });
    if (limit > 0) {
      eventsQuery.limit(limit);
    }
    const events = await eventsQuery;
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

exports.getEventDetails = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, assignedStaff: req.user._id });
    if (!event) return res.status(404).json({ message: 'Event not found or not assigned to you' });
    
    // Ensure default documents object
    if (!event.documents) {
      event.documents = {};
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event details', error: error.message });
  }
};

exports.updateEventDetails = async (req, res) => {
  try {
    const { venue, duration, staffNotes } = req.body;
    
    const event = await Event.findOne({ _id: req.params.id, assignedStaff: req.user._id });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (venue) event.venue = venue;
    if (duration !== undefined) event.duration = duration;
    if (staffNotes !== undefined) event.staffNotes = staffNotes;
    
    if (event.staffStatus === 'PENDING') event.staffStatus = 'IN_PROGRESS';

    await event.save();
    res.json({ message: 'Event details updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event details', error: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, assignedStaff: req.user._id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const docType = req.params.docType; // invitation, profile, attendance, feedback, photos
    const files = req.files || (req.file ? [req.file] : []);

    if (!files.length) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!event.documents) event.documents = {};

    if (docType === 'photos') {
      const paths = files.map(f => f.path.replace(/\\/g, '/'));
      event.documents.photos = [...(event.documents.photos || []), ...paths];
    } else {
      event.documents[docType] = files[0].path.replace(/\\/g, '/');
    }

    if (event.staffStatus === 'PENDING') event.staffStatus = 'IN_PROGRESS';

    await event.save();
    res.json({ message: `${docType} uploaded successfully`, documents: event.documents });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
};

exports.submitEventToHOD = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, assignedStaff: req.user._id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.staffStatus = 'COMPLETED';
    await event.save();
    
    // Notify HOD logic could go here
    
    res.json({ message: 'Event submitted to HOD successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting event', error: error.message });
  }
};
