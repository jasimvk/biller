const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to a sqlite database (or create it if it doesn't exist)
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error('Error connecting to database', err.message);
  }
  console.log('Connected to sqlite database.');
});

// Create necessary tables
db.serialize(() => {
  // Customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      address TEXT
    )
  `);

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT
    )
  `);

  // Invoices table
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      invoice_date DATE DEFAULT CURRENT_DATE,
      due_date DATE,
      total_amount DECIMAL(10,2),
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

  // Invoice items table
  db.run(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      unit_price DECIMAL(10,2),
      FOREIGN KEY (invoice_id) REFERENCES invoices(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);
});

// API Endpoints
// Customers
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ customers: rows });
  });
});

app.post('/api/customers', (req, res) => {
  const { name, email, phone, address } = req.body;
  const sql = 'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)';
  db.run(sql, [name, email, phone, address], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ products: rows });
  });
});

app.post('/api/products', (req, res) => {
  const { name, price, description } = req.body;
  const sql = 'INSERT INTO products (name, price, description) VALUES (?, ?, ?)';
  db.run(sql, [name, price, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Invoices
app.get('/api/invoices', (req, res) => {
  const sql = `
    SELECT i.*, c.name as customer_name 
    FROM invoices i 
    JOIN customers c ON i.customer_id = c.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ invoices: rows });
  });
});

app.post('/api/invoices', (req, res) => {
  const { customer_id, due_date, items } = req.body;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    const invoiceSql = 'INSERT INTO invoices (customer_id, due_date) VALUES (?, ?)';
    db.run(invoiceSql, [customer_id, due_date], function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      const invoice_id = this.lastID;
      let total_amount = 0;
      
      const itemPromises = items.map(item => {
        return new Promise((resolve, reject) => {
          const itemSql = 'INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)';
          db.run(itemSql, [invoice_id, item.product_id, item.quantity, item.unit_price], (err) => {
            if (err) reject(err);
            total_amount += item.quantity * item.unit_price;
            resolve();
          });
        });
      });

      Promise.all(itemPromises)
        .then(() => {
          const updateSql = 'UPDATE invoices SET total_amount = ? WHERE id = ?';
          db.run(updateSql, [total_amount, invoice_id], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: err.message });
            }
            db.run('COMMIT');
            res.json({ id: invoice_id, total_amount });
          });
        })
        .catch(err => {
          db.run('ROLLBACK');
          res.status(500).json({ error: err.message });
        });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 