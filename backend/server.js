require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { createServer } = require('http');
const { db } = require('./config/database');
const { DatabaseError } = require('./utils/errors');
const { databaseErrorHandler } = require('./middleware/databaseErrorHandler');
const productsRouter = require('./routes/products');
const businessRoutes = require('./routes/businessRoutes');

const app = express();
const server = createServer(app);

const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'https://biller-three.vercel.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/products', productsRouter(db));
app.use('/api/business', businessRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// Error handling
app.use(databaseErrorHandler);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await new Promise((resolve, reject) => {
      db.get('SELECT 1', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('Database connection successful');
    
    const availablePort = await detectPort(port);
    app.listen(availablePort, () => {
      console.log(`Server running on port ${availablePort}`);
      console.log(`API available at http://localhost:${availablePort}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Port detection helper
const detectPort = (port) => {
  return new Promise((resolve, reject) => {
    server.listen(port)
      .on('listening', () => {
        server.close(() => resolve(port));
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(detectPort(port + 1));
        } else {
          reject(err);
        }
      });
  });
};

// Start the server
startServer();

module.exports = app; 