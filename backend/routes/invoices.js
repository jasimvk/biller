const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all invoices
  router.get('/', (req, res) => {
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

  // Get invoices by business
  router.get('/:businessId', (req, res) => {
    const sql = `
      SELECT i.*, c.name as customer_name 
      FROM invoices i 
      JOIN customers c ON i.customer_id = c.id
      WHERE i.business_id = ?
      ORDER BY i.created_at DESC
    `;
    
    db.all(sql, [req.params.businessId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ invoices: rows });
    });
  });

  // Create new invoice
  router.post('/', (req, res) => {
    const {
      business_id, customer_id, invoice_date, due_date,
      place_of_supply, reverse_charge, items
    } = req.body;

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const invoice_number = `INV-${Date.now()}`;
      
      // Reference existing invoice creation logic
      ```javascript:backend/server.js
      startLine: 285
      endLine: 414
      ```
    });
  });

  return router;
}; 