require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const { createServer } = require('http');
const { setupDatabase } = require('./models/database');
const authRoutes = require('./routes/auth');
const conferenceRoutes = require('./routes/conferences');
const attendanceRoutes = require('./routes/attendance');
const surveyRoutes = require('./routes/surveys');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/surveys', surveyRoutes);

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    // Broadcast updates to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Database setup and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await setupDatabase();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
