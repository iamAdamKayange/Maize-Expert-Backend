const { query } = require('../config/db');

// Get all sessions for the logged-in expert
const getSessions = async (req, res) => {
    const expertId = req.user.id;
    try {
        const result = await query(
            `SELECT id, title, updated_at 
             FROM expert_chat_sessions 
             WHERE expert_id = $1 
             ORDER BY updated_at DESC 
             LIMIT 50`,
            [expertId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('getSessions error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new session
const createSession = async (req, res) => {
    const expertId = req.user.id;
    const { title = 'New Conversation' } = req.body;
    try {
        const result = await query(
            `INSERT INTO expert_chat_sessions (expert_id, title, created_at, updated_at)
             VALUES ($1, $2, NOW(), NOW())
             RETURNING id, title, updated_at`,
            [expertId, title]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('createSession error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a session (and all its messages via CASCADE)
const deleteSession = async (req, res) => {
    const expertId = req.user.id;
    const sessionId = req.params.id;
    try {
        // First verify ownership
        const ownerCheck = await query(
            `SELECT id FROM expert_chat_sessions WHERE id = $1 AND expert_id = $2`,
            [sessionId, expertId]
        );
        if (ownerCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Not authorized to delete this session' });
        }
        await query(`DELETE FROM expert_chat_sessions WHERE id = $1`, [sessionId]);
        res.status(204).send();
    } catch (err) {
        console.error('deleteSession error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all messages of a specific session
const getMessages = async (req, res) => {
    const expertId = req.user.id;
    const sessionId = req.params.sessionId;
    try {
        // Verify ownership
        const ownerCheck = await query(
            `SELECT id FROM expert_chat_sessions WHERE id = $1 AND expert_id = $2`,
            [sessionId, expertId]
        );
        if (ownerCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Not authorized to view this session' });
        }
        const messages = await query(
            `SELECT id, role, content, created_at 
             FROM expert_chat_messages 
             WHERE session_id = $1 
             ORDER BY created_at ASC`,
            [sessionId]
        );
        res.json(messages.rows);
    } catch (err) {
        console.error('getMessages error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Save a message (user or assistant) to a session
const saveMessage = async (req, res) => {
    const expertId = req.user.id;
    const sessionId = req.params.sessionId;
    const { role, content } = req.body;

    if (!role || !content || !['user', 'assistant'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role or missing content' });
    }

    try {
        // Verify ownership
        const ownerCheck = await query(
            `SELECT id FROM expert_chat_sessions WHERE id = $1 AND expert_id = $2`,
            [sessionId, expertId]
        );
        if (ownerCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Not authorized to add message to this session' });
        }

        // Insert message
        const result = await query(
            `INSERT INTO expert_chat_messages (session_id, role, content, created_at)
             VALUES ($1, $2, $3, NOW())
             RETURNING id, created_at`,
            [sessionId, role, content]
        );

        // Update session's updated_at timestamp
        await query(
            `UPDATE expert_chat_sessions SET updated_at = NOW() WHERE id = $1`,
            [sessionId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('saveMessage error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getSessions,
    createSession,
    deleteSession,
    getMessages,
    saveMessage
};