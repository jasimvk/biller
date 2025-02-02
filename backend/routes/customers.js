const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all customers
  router.get('/', (req, res) => {
    db.all('SELECT * FROM customers', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ customers: rows });
    });
  });

  // Get customers by business
  router.get('/:businessId', (req, res) => {
    const sql = 'SELECT * FROM customers WHERE business_id = ?';
    db.all(sql, [req.params.businessId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ customers: rows });
    });
  });

  // Add new customer
  router.post('/', (req, res) => {
    const {
      business_id, name, gstin, email, phone,
      billing_address, shipping_address
    } = req.body;

    const sql = `INSERT INTO customers (
      business_id, name, gstin, email, phone,
      billing_address, shipping_address
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
      business_id, name, gstin, email, phone,
      JSON.stringify(billing_address),
      shipping_address ? JSON.stringify(shipping_address) : null
    ], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
  });

  return router;
}; 