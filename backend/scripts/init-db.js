const fs = require('fs');
const path = require('path');

// Create data directory
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('Created data directory:', dataDir);
}

console.log('Database initialization complete'); 