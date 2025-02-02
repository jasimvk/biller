const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'business.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tradeName TEXT NOT NULL,
      legalName TEXT NOT NULL,
      gstin TEXT UNIQUE NOT NULL,
      pan TEXT NOT NULL,
      udyamNumber TEXT,
      registeredAddress TEXT NOT NULL,
      branchAddress TEXT,
      godownAddress TEXT,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      website TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Business table created or already exists');
    }
  });
}

module.exports = { db };