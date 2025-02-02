class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
    this.status = 503;
  }
}

module.exports = {
  DatabaseError
}; 