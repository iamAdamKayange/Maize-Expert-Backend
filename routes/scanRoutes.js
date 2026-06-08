const express = require('express');
const { saveScan, getMyScans } = require('../controllers/scanController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/scans', authMiddleware, saveScan);
router.get('/scans', authMiddleware, getMyScans);

module.exports = router;