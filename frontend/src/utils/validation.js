export const validateInvoice = (invoice) => {
  const errors = [];

  if (!invoice.customer_id) errors.push('Customer is required');
  if (!invoice.invoice_date) errors.push('Invoice date is required');
  if (!invoice.due_date) errors.push('Due date is required');
  if (!invoice.place_of_supply) errors.push('Place of supply is required');

  // GST validation
  if (!invoice.items || invoice.items.length === 0) {
    errors.push('At least one item is required');
  } else {
    let totalGSTAmount = 0;
    invoice.items.forEach((item, index) => {
      if (!item.product_id) errors.push(`Product is required for item ${index + 1}`);
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Invalid quantity for item ${index + 1}`);
      }
      if (!item.unit_price || item.unit_price <= 0) {
        errors.push(`Invalid unit price for item ${index + 1}`);
      }
      if (typeof item.gst_rate !== 'number' || item.gst_rate < 0) {
        errors.push(`Invalid GST rate for item ${index + 1}`);
      }

      // Calculate GST amounts
      const taxableAmount = item.quantity * item.unit_price;
      const gstAmount = (taxableAmount * item.gst_rate) / 100;
      totalGSTAmount += gstAmount;

      // Validate GST calculations
      const expectedTotal = taxableAmount + gstAmount;
      const actualTotal = item.total || 0;
      if (Math.abs(expectedTotal - actualTotal) > 0.01) {
        errors.push(`GST calculation mismatch for item ${index + 1}`);
      }
    });

    // Validate total GST amount
    const declaredGSTAmount = (invoice.total_cgst || 0) + (invoice.total_sgst || 0) + (invoice.total_igst || 0);
    if (Math.abs(totalGSTAmount - declaredGSTAmount) > 0.01) {
      errors.push('Total GST amount mismatch');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateProduct = (product) => {
  const errors = [];

  if (!product.name) errors.push('Product name is required');
  if (!product.hsn_code) errors.push('HSN code is required');
  if (!product.price || product.price <= 0) {
    errors.push('Invalid price');
  }
  if (typeof product.gst_rate !== 'number' || product.gst_rate < 0) {
    errors.push('Invalid GST rate');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 