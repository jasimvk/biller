const { body } = require('express-validator');

const sanitizer = {
  product: [
    body('name').trim().escape(),
    body('description').trim().escape(),
    body('hsn_code').trim().escape(),
    body('price').toFloat(),
    body('gst_rate').toInt()
  ],

  customer: [
    body('name').trim().escape(),
    body('email').normalizeEmail(),
    body('phone').trim().escape(),
    body('gstin').trim().toUpperCase()
  ],

  invoice: [
    body('invoice_date').toDate(),
    body('due_date').optional().toDate(),
    body('place_of_supply').trim().escape(),
    body('items.*.quantity').toInt(),
    body('items.*.unit_price').toFloat()
  ]
};

module.exports = sanitizer; 