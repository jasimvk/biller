const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { db } = require('../config/database');

// Register business route
router.post('/register', businessController.register);
router.get('/', businessController.getAllBusinesses);

// Get business details with all addresses
router.get('/details', async (req, res) => {
  try {
    const business = await new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          id, 
          tradeName, 
          legalName, 
          gstin, 
          pan, 
          mobile, 
          email,
          registeredAddress,
          branchAddress,
          godownAddress
        FROM businesses 
        LIMIT 1`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!business) {
      return res.status(404).json({ error: 'No business found' });
    }

    // Parse JSON strings back to objects
    business.registeredAddress = JSON.parse(business.registeredAddress || '{}');
    business.branchAddress = business.branchAddress ? JSON.parse(business.branchAddress) : null;
    business.godownAddress = business.godownAddress ? JSON.parse(business.godownAddress) : null;

    // Add default values for missing columns
    business.logo = null;
    business.showLogo = false;
    business.showBranchAddress = false;
    business.showGstin = true;

    res.json(business);
  } catch (error) {
    console.error('Error fetching business details:', error);
    res.status(500).json({ error: 'Failed to fetch business details' });
  }
});

// Update business details
router.put('/update', async (req, res) => {
  try {
    const {
      tradeName,
      legalName,
      gstin,
      pan,
      mobile,
      email,
      registeredAddress,
      branchAddress,
      godownAddress
    } = req.body;

    await db.run(
      `UPDATE businesses SET 
        tradeName = ?, 
        legalName = ?, 
        gstin = ?, 
        pan = ?, 
        mobile = ?, 
        email = ?,
        registeredAddress = ?,
        branchAddress = ?,
        godownAddress = ?
      WHERE id = ?`,
      [
        tradeName,
        legalName,
        gstin,
        pan,
        mobile,
        email,
        JSON.stringify(registeredAddress),
        branchAddress ? JSON.stringify(branchAddress) : null,
        godownAddress ? JSON.stringify(godownAddress) : null,
        1
      ]
    );

    res.json({ message: 'Business details updated successfully' });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ error: 'Failed to update business details' });
  }
});

module.exports = router; 