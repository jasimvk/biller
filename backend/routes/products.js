const express = require('express');
const router = express.Router();
const validators = require('../middleware/validators');
const sanitizer = require('../middleware/sanitizer');
const { validate } = require('../middleware/validate');

module.exports = (db) => {
  // Get all products
  router.get('/', (req, res) => {
    db.all('SELECT * FROM products WHERE deleted_at IS NULL', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        status: 'success',
        data: { 
          products: rows || [] // Ensure we always return an array
        }
      });
    });
  });

  // Get products by business
  router.get('/:businessId', (req, res) => {
    const sql = 'SELECT * FROM products WHERE business_id = ?';
    db.all(sql, [req.params.businessId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ products: rows });
    });
  });

  // Add new product
  router.post('/', 
    sanitizer.product,
    validators.product.create,
    validate,
    async (req, res) => {
      try {
        const {
          business_id, name, hsn_code, description,
          price, gst_rate
        } = req.body;

        const sql = `INSERT INTO products (
          business_id, name, hsn_code, description,
          price, gst_rate
        ) VALUES (?, ?, ?, ?, ?, ?)`;

        db.run(sql, [
          business_id, name, hsn_code, description,
          price, gst_rate
        ], function(err) {
          if (err) throw err;
          
          res.status(201).json({
            status: 'success',
            data: { 
              id: this.lastID,
              message: 'Product created successfully'
            },
            timestamp: new Date().toISOString()
          });
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  );

  // Update product
  router.put('/:id',
    sanitizer.product,
    validators.product.update,
    validate,
    async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        
        const fields = Object.keys(updates)
          .filter(key => updates[key] !== undefined)
          .map(key => `${key} = ?`)
          .join(', ');
        
        const values = Object.keys(updates)
          .filter(key => updates[key] !== undefined)
          .map(key => updates[key]);
        
        const sql = `UPDATE products SET ${fields} WHERE id = ? AND deleted_at IS NULL`;
        
        db.run(sql, [...values, id], function(err) {
          if (err) throw err;
          
          if (this.changes === 0) {
            return res.status(404).json({
              status: 'error',
              message: 'Product not found',
              timestamp: new Date().toISOString()
            });
          }
          
          res.json({
            status: 'success',
            data: { 
              id: parseInt(id),
              message: 'Product updated successfully'
            },
            timestamp: new Date().toISOString()
          });
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  );

  return router;
}; 