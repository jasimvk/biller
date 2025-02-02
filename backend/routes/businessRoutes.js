const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

// Register business route
router.post('/register', businessController.register);
router.get('/', businessController.getAllBusinesses);

module.exports = router; 