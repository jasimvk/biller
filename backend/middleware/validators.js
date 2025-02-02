const { body, param, query } = require('express-validator');

const validators = {
  product: {
    create: [
      body('business_id').isInt().withMessage('Business ID is required'),
      body('name').trim().notEmpty().withMessage('Product name is required'),
      body('hsn_code').trim().notEmpty().withMessage('HSN code is required'),
      body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
      body('gst_rate').isInt({ min: 0, max: 28 }).withMessage('GST rate must be between 0 and 28')
    ],
    update: [
      param('id').isInt().withMessage('Invalid product ID'),
      body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
      body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
      body('gst_rate').optional().isInt({ min: 0, max: 28 }).withMessage('GST rate must be between 0 and 28')
    ]
  },

  customer: {
    create: [
      body('business_id').isInt().withMessage('Business ID is required'),
      body('name').trim().notEmpty().withMessage('Customer name is required'),
      body('gstin').optional().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).withMessage('Invalid GSTIN format'),
      body('email').optional().isEmail().withMessage('Invalid email format'),
      body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
      body('billing_address').isObject().withMessage('Billing address is required')
    ]
  },

  invoice: {
    create: [
      body('business_id').isInt().withMessage('Business ID is required'),
      body('customer_id').isInt().withMessage('Customer ID is required'),
      body('invoice_date').isDate().withMessage('Valid invoice date is required'),
      body('place_of_supply').notEmpty().withMessage('Place of supply is required'),
      body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
      body('items.*.product_id').isInt().withMessage('Product ID is required for each item'),
      body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
      body('items.*.unit_price').isFloat({ min: 0 }).withMessage('Unit price must be positive')
    ]
  }
};

module.exports = validators; 