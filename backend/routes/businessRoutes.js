const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { db } = require('../config/database');

// Register business route
router.post('/register', businessController.register);
router.get('/', businessController.getAllBusinesses);

// Get business details
router.get('/details', async (req, res) => {
  try {
    // For now, we'll just return the first business
    // Later, you can add authentication to return the specific business
    const business = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM businesses LIMIT 1',
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!business) {
      return res.status(404).json({ error: 'No business found' });
    }

    res.json(business);
  } catch (error) {
    console.error('Error fetching business details:', error);
    res.status(500).json({ error: 'Failed to fetch business details' });
  }
});

module.exports = router; 