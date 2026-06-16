const scanModel = require('../models/scanModel');
const scanModel = require('../models/scanModel');

const saveScan = async (req, res) => {
  try {
    const { label, confidence, scores, imageUrl } = req.body;
    const expertId = req.user.id;
    const expertName = req.user.name;

    if (!label || confidence === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const saved = await scanModel.saveScan(expertId, expertName, label, confidence, scores, imageUrl);
    res.status(201).json({ id: saved.id, message: 'Scan saved successfully' });
  } catch (error) {
    console.error('Save scan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyScans = async (req, res) => {
  try {
    const scans = await scanModel.getScansByExpertId(req.user.id);
    res.json(scans);
  } catch (error) {
    console.error('Get scans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllScans = async (req, res) => {
  try {
    const scans = await scanModel.getAllScans();
    res.json(scans);
  } catch (error) {
    console.error('Get all scans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Build URL for the uploaded image
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { saveScan, getMyScans, getAllScans, uploadImage };
