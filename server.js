require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ✅ Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Maize Expert API is running',
    status: 'online',
    endpoints: {
      health: '/api/health',
      login: '/api/expert/login',
      scans: '/api/expert/scans',
      upload: '/api/expert/upload-image'
    }
  });
});

app.use('/api/expert', authRoutes);
app.use('/api/expert', scanRoutes);
app.use('/api/expert/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Expert backend running on port ${PORT}`);
});