const Slider = require('../models/Slider');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// GET /api/sliders — public
exports.getSliders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active === 'true') filter.isActive = true;
    const sliders = await Slider.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/sliders/upload — admin only
exports.uploadSlider = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'sliders',
      transformation: [{ width: 1920, height: 1080, crop: 'fill', gravity: 'auto' }],
    });

    // Remove temp file
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    const slider = await Slider.create({
      title: req.body.title || '',
      imageUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      order: parseInt(req.body.order) || 0,
    });

    res.status(201).json({ message: 'Slider uploaded successfully', slider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/sliders/:id — admin only
exports.updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });

    const { title, isActive, order } = req.body;
    if (title !== undefined) slider.title = title;
    if (isActive !== undefined) slider.isActive = isActive;
    if (order !== undefined) slider.order = order;

    await slider.save();
    res.json({ message: 'Slider updated', slider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/sliders/:id — admin only
exports.deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });

    // Remove from Cloudinary
    if (slider.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(slider.cloudinaryPublicId);
    }

    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slider deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
