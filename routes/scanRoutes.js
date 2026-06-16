const express = require('express');
const { saveScan, getMyScans, uploadImage } = require('../controllers/scanController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // tutaunda hii
const router = express.Router();

router.post('/scans', authMiddleware, saveScan);
router.get('/scans', authMiddleware, getMyScans);
router.post('/upload-image', authMiddleware, upload.single('image'), uploadImage);

module.exports = router;