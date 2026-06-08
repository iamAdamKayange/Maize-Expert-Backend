const express = require('express');
const { 
    getSessions, 
    createSession, 
    deleteSession, 
    getMessages, 
    saveMessage 
} = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All chat routes require authentication
router.use(authMiddleware);

// Session management
router.get('/sessions', getSessions);
router.post('/sessions', createSession);
router.delete('/sessions/:id', deleteSession);

// Messages
router.get('/sessions/:sessionId/messages', getMessages);
router.post('/sessions/:sessionId/messages', saveMessage);

module.exports = router;