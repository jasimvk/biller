export const GSTUtils = {
  // GST rates lookup table
  GST_RATES: {
    // Essential goods
    '0401': 5,  // Milk and cream
    '1001': 5,  // Wheat and meslin
    '3001': 12, // Pharmaceutical products
    // Standard goods
    '8517': 18, // Telephones
    '8471': 18, // Computers
    '8473': 18, // Parts for computers
    // Luxury goods
    '8703': 28, // Motor cars
    '7113': 28, // Jewelry
    // Add more HSN codes as needed
  },

  // Detect GST rate from HSN code
  detectGSTRate(hsnCode) {
    const category = hsnCode.substring(0, 4);
    return this.GST_RATES[category] || null;
  },

  // Calculate GST components
  calculateGSTComponents(amount, rate, placeOfSupply, businessState) {
    const isInterState = placeOfSupply !== businessState;
    const gstAmount = (amount * rate) / 100;

    return {
      taxableAmount: amount,
      cgstAmount: isInterState ? 0 : gstAmount / 2,
      sgstAmount: isInterState ? 0 : gstAmount / 2,
      igstAmount: isInterState ? gstAmount : 0,
      totalAmount: amount + gstAmount
    };
  },

  // Generate GST summary
  generateGSTSummary(invoices) {
    const summary = {
      totalTaxableAmount: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
      rateWiseSummary: {},
      stateWiseSummary: {},
      monthWiseSummary: {}
    };

    invoices.forEach(invoice => {
      // Add to totals
      summary.totalTaxableAmount += invoice.total_taxable_amount;
      summary.totalCGST += invoice.total_cgst;
      summary.totalSGST += invoice.total_sgst;
      summary.totalIGST += invoice.total_igst;

      // Rate-wise summary
      invoice.items.forEach(item => {
        const rateKey = `${item.gst_rate}%`;
        if (!summary.rateWiseSummary[rateKey]) {
          summary.rateWiseSummary[rateKey] = {
            taxableAmount: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
            count: 0
          };
        }
        summary.rateWiseSummary[rateKey].taxableAmount += item.taxable_amount;
        summary.rateWiseSummary[rateKey].cgst += item.cgst_amount;
        summary.rateWiseSummary[rateKey].sgst += item.sgst_amount;
        summary.rateWiseSummary[rateKey].igst += item.igst_amount;
        summary.rateWiseSummary[rateKey].count++;
      });

      // State-wise summary
      const stateKey = invoice.place_of_supply;
      if (!summary.stateWiseSummary[stateKey]) {
        summary.stateWiseSummary[stateKey] = {
          taxableAmount: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          count: 0
        };
      }
      summary.stateWiseSummary[stateKey].taxableAmount += invoice.total_taxable_amount;
      summary.stateWiseSummary[stateKey].cgst += invoice.total_cgst;
      summary.stateWiseSummary[stateKey].sgst += invoice.total_sgst;
      summary.stateWiseSummary[stateKey].igst += invoice.total_igst;
      summary.stateWiseSummary[stateKey].count++;

      // Month-wise summary
      const monthKey = new Date(invoice.invoice_date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!summary.monthWiseSummary[monthKey]) {
        summary.monthWiseSummary[monthKey] = {
          taxableAmount: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          count: 0
        };
      }
      summary.monthWiseSummary[monthKey].taxableAmount += invoice.total_taxable_amount;
      summary.monthWiseSummary[monthKey].cgst += invoice.total_cgst;
      summary.monthWiseSummary[monthKey].sgst += invoice.total_sgst;
      summary.monthWiseSummary[monthKey].igst += invoice.total_igst;
      summary.monthWiseSummary[monthKey].count++;
    });

    return summary;
  },

  // Export GST report
  exportGSTReport(summary, format = 'json') {
    switch (format) {
      case 'csv':
        return this.generateCSVReport(summary);
      case 'json':
        return JSON.stringify(summary, null, 2);
      case 'gstr1':
        return this.generateGSTR1Format(summary);
      default:
        return JSON.stringify(summary, null, 2);
    }
  },

  generateGSTR1Format(summary) {
    return {
      "gstin": "", // To be filled from business details
      "fp": "", // Filing period
      "version": "GST3.0.4",
      "hash": "", // To be generated
      "b2b": this.generateB2BInvoices(summary),
      "b2cs": this.generateB2CSInvoices(summary),
      "hsn": this.generateHSNSummary(summary),
      "docs": this.generateDocumentSummary(summary)
    };
  },

  generateB2BInvoices(summary) {
    const b2bInvoices = [];
    // Group by GSTIN
    Object.entries(summary.gstinWiseSummary || {}).forEach(([gstin, data]) => {
      b2bInvoices.push({
        "ctin": gstin,
        "inv": data.invoices.map(inv => ({
          "inum": inv.invoice_number,
          "idt": inv.invoice_date,
          "val": inv.total_amount,
          "pos": inv.place_of_supply,
          "rchrg": inv.reverse_charge ? "Y" : "N",
          "itms": inv.items.map(item => ({
            "num": item.item_number,
            "itm_det": {
              "txval": item.taxable_amount,
              "rt": item.gst_rate,
              "camt": item.cgst_amount,
              "samt": item.sgst_amount,
              "iamt": item.igst_amount
            }
          }))
        }))
      });
    });
    return b2bInvoices;
  },

  generateHSNSummary(summary) {
    const hsnSummary = [];
    Object.entries(summary.hsnWiseSummary || {}).forEach(([hsn, data]) => {
      hsnSummary.push({
        "hsn_sc": hsn,
        "desc": data.description,
        "uqc": data.unit,
        "qty": data.quantity,
        "val": data.value,
        "txval": data.taxable_value,
        "iamt": data.igst,
        "camt": data.cgst,
        "samt": data.sgst
      });
    });
    return hsnSummary;
  },

  generateDocumentSummary(summary) {
    return {
      "doc_det": {
        "doc_num": summary.totalInvoices,
        "docs": [
          {
            "num": summary.totalB2BInvoices,
            "from": "",
            "to": "",
            "totnum": summary.totalB2BInvoices,
            "cancel": 0,
            "net_issue": summary.totalB2BInvoices
          }
        ]
      }
    };
  }
}; 