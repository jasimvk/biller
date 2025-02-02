const { DatabaseError } = require('../utils/errors');

function databaseErrorHandler(err, req, res, next) {
  if (err instanceof DatabaseError) {
    console.error('Database Error:', err);
    return res.status(err.status).json({
      error: {
        message: 'Database service unavailable',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      }
    });
  }
  next(err);
}

module.exports = {
  databaseErrorHandler
}; 