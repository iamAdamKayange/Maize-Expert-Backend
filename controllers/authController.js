const jwt = require('jsonwebtoken');
const expertModel = require('../models/expertModel');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const expert = await expertModel.findExpertByEmail(email);
    if (!expert) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await expertModel.verifyPassword(password, expert.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: expert.id, email: expert.email, name: expert.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      expert: {
        id: expert.id,
        name: expert.name,
        email: expert.email,
        expertise: expert.expertise
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };