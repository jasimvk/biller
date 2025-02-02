import { GSTCalculator } from '../utils/gstCalculator';

export const GSTService = {
  calculateInvoiceTotals(invoice, businessState) {
    const stateSummary = this.getStateSummary(invoice, businessState);
    const hsnSummary = this.getHSNSummary(invoice.items);
    const gstTotals = GSTCalculator.calculateInvoiceGST(invoice, businessState);

    return {
      ...gstTotals,
      stateSummary,
      hsnSummary
    };
  },

  getStateSummary(invoice, businessState) {
    const stateCode = invoice.place_of_supply.substring(0, 2);
    const isIntraState = stateCode === businessState.substring(0, 2);

    return {
      stateCode,
      isIntraState,
      summary: isIntraState ? {
        intraState: {
          taxableAmount: invoice.total_taxable_amount,
          cgst: invoice.total_cgst,
          sgst: invoice.total_sgst,
          igst: 0
        }
      } : {
        interState: {
          taxableAmount: invoice.total_taxable_amount,
          cgst: 0,
          sgst: 0,
          igst: invoice.total_igst
        }
      }
    };
  },

  getHSNSummary(items) {
    const hsnMap = new Map();

    items.forEach(item => {
      if (!hsnMap.has(item.hsn_code)) {
        hsnMap.set(item.hsn_code, {
          quantity: 0,
          taxableAmount: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: 0
        });
      }

      const summary = hsnMap.get(item.hsn_code);
      summary.quantity += item.quantity;
      summary.taxableAmount += item.taxable_amount;
      summary.cgst += item.cgst_amount;
      summary.sgst += item.sgst_amount;
      summary.igst += item.igst_amount;
      summary.total += item.total_amount;
    });

    return Array.from(hsnMap.entries()).map(([hsn, summary]) => ({
      hsn_code: hsn,
      ...summary
    }));
  },

  validateGSTComponents(invoice) {
    const errors = [];
    
    // Reference existing validation logic
    const { isValid, errors: calcErrors } = GSTCalculator.validateGSTCalculation(invoice);
    if (!isValid) {
      errors.push(...calcErrors);
    }

    // Validate state-wise calculations
    const stateSummary = this.getStateSummary(invoice, invoice.business_state);
    if (stateSummary.isIntraState) {
      if (invoice.total_igst !== 0) {
        errors.push('IGST should be 0 for intra-state transactions');
      }
    } else {
      if (invoice.total_cgst !== 0 || invoice.total_sgst !== 0) {
        errors.push('CGST and SGST should be 0 for inter-state transactions');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}; 