const express = require('express');
const {
  saveScan,
  getMyScans,
  getAllScans,
  uploadImage,
} = require('../controllers/scanController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/scans', authMiddleware, saveScan);
router.get('/scans', authMiddleware, getMyScans);
router.get('/scans/all', authMiddleware, getAllScans); // Admin/All scans endpoint
router.post('/upload-image', authMiddleware, upload.single('image'), uploadImage);

module.exports = router;