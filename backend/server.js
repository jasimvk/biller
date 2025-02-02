require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { createServer } = require('http');
const { db, testConnection } = require('./config/database');
const { DatabaseError } = require('./utils/errors');
const { databaseErrorHandler } = require('./middleware/databaseErrorHandler');
const productsRouter = require('./routes/products');

const app = express();
const server = createServer(app);

const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/products', productsRouter(db));

// Error handling
app.use(databaseErrorHandler);

// Start server
async function startServer() {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Unable to connect to database');
    }

    const availablePort = await detectPort(port);
    app.listen(availablePort, () => {
      console.log(`Server running on port ${availablePort}`);
      console.log(`API available at http://localhost:${availablePort}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

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

startServer(); 