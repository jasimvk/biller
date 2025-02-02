import { GSTUtils } from './gstUtils';

// Constants for GST calculations
const DECIMAL_PLACES = 2;
const ROUNDING_METHOD = 'ROUND_HALF_UP'; // As per GST rules

// Validate currency amount
export const isValidAmount = (amount) => {
  if (typeof amount !== 'number') return false;
  if (isNaN(amount) || !isFinite(amount)) return false;
  if (amount < 0) return false;
  // Check if amount has more than 2 decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  return decimalPlaces <= DECIMAL_PLACES;
};

// Round amount as per GST rules
export const roundAmount = (amount) => {
  if (!isValidAmount(amount)) return 0;
  const multiplier = Math.pow(10, DECIMAL_PLACES);
  
  if (ROUNDING_METHOD === 'ROUND_HALF_UP') {
    return Math.round(amount * multiplier) / multiplier;
  }
  return amount;
};

// Calculate GST components
export const calculateGSTComponents = (baseAmount, gstRate, placeOfSupply) => {
  if (!isValidAmount(baseAmount) || !isValidAmount(gstRate)) {
    throw new Error('Invalid amount or GST rate');
  }

  const taxableAmount = roundAmount(baseAmount);
  const totalGSTAmount = roundAmount((taxableAmount * gstRate) / 100);

  // If place of supply is different state, apply IGST
  // Otherwise split into CGST and SGST
  const isIGST = placeOfSupply === 'other_state';
  
  return {
    taxableAmount,
    cgstRate: isIGST ? 0 : gstRate / 2,
    cgstAmount: isIGST ? 0 : roundAmount(totalGSTAmount / 2),
    sgstRate: isIGST ? 0 : gstRate / 2,
    sgstAmount: isIGST ? 0 : roundAmount(totalGSTAmount / 2),
    igstRate: isIGST ? gstRate : 0,
    igstAmount: isIGST ? totalGSTAmount : 0,
    totalAmount: roundAmount(taxableAmount + totalGSTAmount)
  };
};

// Calculate invoice totals
export const calculateInvoiceTotals = (items, placeOfSupply) => {
  return items.reduce((totals, item) => {
    const gstComponents = calculateGSTComponents(
      item.quantity * item.unit_price,
      item.gst_rate,
      placeOfSupply
    );

    return {
      taxableAmount: roundAmount(totals.taxableAmount + gstComponents.taxableAmount),
      cgstAmount: roundAmount(totals.cgstAmount + gstComponents.cgstAmount),
      sgstAmount: roundAmount(totals.sgstAmount + gstComponents.sgstAmount),
      igstAmount: roundAmount(totals.igstAmount + gstComponents.igstAmount),
      totalAmount: roundAmount(totals.totalAmount + gstComponents.totalAmount)
    };
  }, {
    taxableAmount: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    totalAmount: 0
  });
};

// Format amount for display
export const formatAmount = (amount) => {
  if (!isValidAmount(amount)) return '0.00';
  return roundAmount(amount).toFixed(2);
};

export class GSTCalculator {
  static VALID_RATES = [0, 5, 12, 18, 28];

  static isValidGSTRate(rate) {
    return this.VALID_RATES.includes(Number(rate));
  }

  static calculateGST(amount, rate) {
    if (!this.isValidGSTRate(rate)) {
      throw new Error('Invalid GST rate');
    }
    const gstAmount = (amount * rate) / 100;
    return {
      gstAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      total: amount + gstAmount
    };
  }

  static getValidRates() {
    return this.VALID_RATES;
  }

  calculateInvoiceGST(invoice, businessState) {
    const isInterState = invoice.place_of_supply !== businessState;
    let totalTaxableAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    invoice.items.forEach(item => {
      const taxableAmount = item.quantity * item.unit_price;
      const gstAmount = (taxableAmount * item.gst_rate) / 100;

      totalTaxableAmount += taxableAmount;
      if (isInterState) {
        totalIGST += gstAmount;
      } else {
        totalCGST += gstAmount / 2;
        totalSGST += gstAmount / 2;
      }
    });

    return {
      total_taxable_amount: totalTaxableAmount,
      total_cgst: totalCGST,
      total_sgst: totalSGST,
      total_igst: totalIGST,
      total_amount: totalTaxableAmount + totalCGST + totalSGST + totalIGST
    };
  }

  calculateItemGST(item, placeOfSupply, businessState) {
    const taxableAmount = item.quantity * item.unit_price;
    const gstAmount = (taxableAmount * item.gst_rate) / 100;
    const isInterState = placeOfSupply !== businessState;

    return {
      taxable_amount: taxableAmount,
      cgst_amount: isInterState ? 0 : gstAmount / 2,
      sgst_amount: isInterState ? 0 : gstAmount / 2,
      igst_amount: isInterState ? gstAmount : 0,
      total_amount: taxableAmount + gstAmount
    };
  }

  validateGSTCalculation(invoice) {
    let isValid = true;
    const errors = [];

    // Validate totals
    const calculatedTotals = this.calculateInvoiceGST(invoice, invoice.business_state);
    
    if (Math.abs(calculatedTotals.total_amount - invoice.total_amount) > 0.01) {
      isValid = false;
      errors.push('Invoice total amount mismatch');
    }

    // Validate individual items
    invoice.items.forEach((item, index) => {
      const calculatedItem = this.calculateItemGST(item, invoice.place_of_supply, invoice.business_state);
      
      if (Math.abs(calculatedItem.total_amount - item.total_amount) > 0.01) {
        isValid = false;
        errors.push(`Item ${index + 1} total amount mismatch`);
      }
    });

    return { isValid, errors };
  }
}

export const validateGSTProduct = (product) => {
  const errors = {};

  if (!product.name?.trim()) {
    errors.name = 'Product name is required';
  }

  if (!product.hsn_code?.trim()) {
    errors.hsn_code = 'HSN code is required';
  }

  if (!product.price || product.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (!GSTCalculator.isValidGSTRate(product.gst_rate)) {
    errors.gst_rate = 'Invalid GST rate. Valid rates are: ' + GSTCalculator.VALID_RATES.join(', ') + '%';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 