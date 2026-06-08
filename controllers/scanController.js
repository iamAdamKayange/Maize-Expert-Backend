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

module.exports = { saveScan, getMyScans, getAllScans };