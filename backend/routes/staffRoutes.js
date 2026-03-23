const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Base route: /api/staff
router.use(protect);
router.use(authorizeRoles('STAFF'));

router.get('/stats', staffController.getDashboardStats);
router.get('/events', staffController.getAssignedEvents);
router.get('/events/:id', staffController.getEventDetails);
router.put('/events/:id/details', staffController.updateEventDetails);

// Document uploads (array for photos, single for others)
// Assuming form field matches docType or generic 'documents' / 'document'
router.post('/events/:id/upload/:docType', upload.any(), staffController.uploadDocument);

router.put('/events/:id/submit', staffController.submitEventToHOD);

module.exports = router;
