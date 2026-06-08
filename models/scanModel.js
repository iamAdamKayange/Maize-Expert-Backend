const pool = require('../config/db');

const saveScan = async (expertId, expertName, label, confidence, scores, imageUrl) => {
  const result = await pool.query(
    `INSERT INTO expert_scans (expert_id, expert_name, label, confidence, scores, image_url, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING id`,
    [expertId, expertName, label, confidence, JSON.stringify(scores), imageUrl]
  );
  return result.rows[0];
};

const getScansByExpertId = async (expertId, limit = 50) => {
  const result = await pool.query(
    `SELECT id, label, confidence, scores, image_url, created_at
     FROM expert_scans
     WHERE expert_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [expertId, limit]
  );
  return result.rows;
};

const getAllScans = async (limit = 100) => {
  const result = await pool.query(
    `SELECT es.*, e.name as expert_name
     FROM expert_scans es
     JOIN experts e ON es.expert_id = e.id
     ORDER BY es.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

module.exports = { saveScan, getScansByExpertId, getAllScans };