require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const chatRoutes = require('./routes/chatRoutes');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============ ADD THIS ROOT ROUTE ============
app.get('/', (req, res) => {
  res.json({
    message: 'Maize Expert API is running',
    status: 'online',
    endpoints: {
      health: '/api/health',
      login: '/api/expert/login',
      scans: '/api/expert/scans'
    }
  });
});
// =============================================

app.use('/api/expert', authRoutes);
app.use('/api/expert', scanRoutes);

app.use('/api/expert/chat', chatRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Expert backend running on port ${PORT}`);
});