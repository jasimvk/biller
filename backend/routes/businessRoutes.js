const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { db } = require('../config/database');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/logos',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

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
          godownAddress,
          logo,
          showLogo,
          showBranchAddress,
          showGstin
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
      godownAddress,
      showLogo,
      showBranchAddress,
      showGstin
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
        godownAddress = ?,
        showLogo = ?,
        showBranchAddress = ?,
        showGstin = ?
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
        showLogo,
        showBranchAddress,
        showGstin,
        1
      ]
    );

    res.json({ message: 'Business details updated successfully' });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ error: 'Failed to update business details' });
  }
});

// Upload logo
router.post('/upload-logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const logoPath = `/uploads/logos/${req.file.filename}`;
    
    await db.run(
      'UPDATE businesses SET logo = ? WHERE id = ?',
      [logoPath, 1]
    );

    res.json({ 
      message: 'Logo uploaded successfully',
      logoPath 
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

module.exports = router; 