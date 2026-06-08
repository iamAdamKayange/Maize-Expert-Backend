const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const findExpertByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM experts WHERE email = $1', [email]);
  return result.rows[0];
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { findExpertByEmail, verifyPassword };