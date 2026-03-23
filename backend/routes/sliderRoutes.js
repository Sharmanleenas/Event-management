const express = require('express');
const router = express.Router();
const {
  getSliders,
  uploadSlider,
  updateSlider,
  deleteSlider,
} = require('../controllers/sliderController');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `slider-${Date.now()}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// Public
router.get('/', getSliders);

// Admin protected
router.post('/upload', protect, authorizeRoles('ADMIN'), upload.single('slider'), uploadSlider);
router.put('/:id', protect, authorizeRoles('ADMIN'), updateSlider);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deleteSlider);

module.exports = router;
