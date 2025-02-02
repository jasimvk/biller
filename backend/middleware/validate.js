const { validationResult } = require('express-validator');

const formatError = (error) => {
  switch (error.type) {
    case 'field':
      return `${error.path}: ${error.msg}`;
    default:
      return error.msg;
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req).formatWith(formatError);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.mapped(),
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

// Custom validation helper
const customValidators = {
  isValidGSTIN: (value) => {
    if (!value) return true; // Optional GSTIN
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(value);
  },
  
  isValidHSN: (value) => {
    if (!value) return false;
    const hsnRegex = /^[0-9]{4,8}$/;
    return hsnRegex.test(value);
  },
  
  isValidPhone: (value) => {
    if (!value) return true; // Optional phone
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value);
  }
};

module.exports = {
  validate,
  customValidators
}; 