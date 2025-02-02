const { db } = require('../config/database');
const { DatabaseError } = require('../utils/errors');

// Validation helper functions moved outside the controller object
const validateGSTIN = (gstin) => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

const validateMobile = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const businessController = {
  async register(req, res, next) {
    const {
      tradeName,
      legalName,
      gstin,
      pan,
      udyamNumber,
      registeredAddress,
      branchAddress,
      godownAddress,
      mobile,
      email,
      website
    } = req.body;

    try {
      // Validate required fields
      if (!tradeName || !legalName || !gstin || !pan || !mobile || !email) {
        return res.status(400).json({
          error: 'Missing required fields'
        });
      }

      // Validate GSTIN format
      if (!validateGSTIN(gstin)) {
        return res.status(400).json({
          error: 'Invalid GSTIN format'
        });
      }

      // Validate PAN format
      if (!validatePAN(pan)) {
        return res.status(400).json({
          error: 'Invalid PAN format'
        });
      }

      // Validate mobile number
      if (!validateMobile(mobile)) {
        return res.status(400).json({
          error: 'Invalid mobile number format'
        });
      }

      // Validate email
      if (!validateEmail(email)) {
        return res.status(400).json({
          error: 'Invalid email format'
        });
      }

      // Check if GSTIN already exists
      const existingBusiness = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM businesses WHERE gstin = ?', [gstin], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });

      if (existingBusiness) {
        return res.status(409).json({
          error: 'Business with this GSTIN already exists'
        });
      }

      // Validate address structure
      if (!registeredAddress || !registeredAddress.city || !registeredAddress.state || !registeredAddress.pinCode) {
        return res.status(400).json({
          error: 'Invalid registered address format'
        });
      }

      // Insert new business
      const sql = `
        INSERT INTO businesses (
          tradeName,
          legalName,
          gstin,
          pan,
          udyamNumber,
          registeredAddress,
          branchAddress,
          godownAddress,
          mobile,
          email,
          website
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await new Promise((resolve, reject) => {
        db.run(sql, [
          tradeName,
          legalName,
          gstin,
          pan,
          udyamNumber || null,
          JSON.stringify(registeredAddress),
          branchAddress ? JSON.stringify(branchAddress) : null,
          godownAddress ? JSON.stringify(godownAddress) : null,
          mobile,
          email,
          website || null
        ], function(err) {
          if (err) reject(err);
          resolve(this);
        });
      });

      // Get the inserted business
      const insertedBusiness = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM businesses WHERE id = ?', [result.lastID], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });

      res.status(201).json({
        message: 'Business registered successfully',
        data: insertedBusiness
      });

    } catch (error) {
      console.error('Error registering business:', error);
      next(new DatabaseError('Failed to register business'));
    }
  },

  async getAllBusinesses(req, res, next) {
    try {
      const businesses = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM businesses ORDER BY created_at DESC', (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });

      res.json(businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      next(new DatabaseError('Failed to fetch businesses'));
    }
  },

  // Add other business-related controllers here
};

module.exports = businessController; 