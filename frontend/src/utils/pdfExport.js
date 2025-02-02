import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const PDFExport = {
  generateGSTReport(summary, businessDetails) {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('GST Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 22);
    
    // Add business details
    doc.setFontSize(12);
    doc.text(`Business: ${businessDetails.name}`, 14, 30);
    doc.text(`GSTIN: ${businessDetails.gstin}`, 14, 36);
    
    // Summary section
    doc.setFontSize(14);
    doc.text('Summary', 14, 45);
    
    const summaryData = [
      ['Total Taxable Amount', `₹${summary.totalTaxableAmount.toFixed(2)}`],
      ['Total CGST', `₹${summary.totalCGST.toFixed(2)}`],
      ['Total SGST', `₹${summary.totalSGST.toFixed(2)}`],
      ['Total IGST', `₹${summary.totalIGST.toFixed(2)}`],
      ['Total Tax', `₹${(summary.totalCGST + summary.totalSGST + summary.totalIGST).toFixed(2)}`]
    ];
    
    doc.autoTable({
      startY: 50,
      head: [['Description', 'Amount']],
      body: summaryData,
      theme: 'grid'
    });
    
    // Rate-wise summary
    doc.text('Rate-wise Summary', 14, doc.lastAutoTable.finalY + 10);
    
    const rateWiseData = Object.entries(summary.rateWiseSummary).map(([rate, data]) => [
      rate,
      `₹${data.taxableAmount.toFixed(2)}`,
      `₹${data.cgst.toFixed(2)}`,
      `₹${data.sgst.toFixed(2)}`,
      `₹${data.igst.toFixed(2)}`,
      data.count.toString()
    ]);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Rate', 'Taxable Amount', 'CGST', 'SGST', 'IGST', 'Count']],
      body: rateWiseData,
      theme: 'grid'
    });
    
    // Monthly summary
    doc.addPage();
    doc.text('Monthly Summary', 14, 15);
    
    const monthlyData = Object.entries(summary.monthWiseSummary).map(([month, data]) => [
      month,
      `₹${data.taxableAmount.toFixed(2)}`,
      `₹${data.cgst.toFixed(2)}`,
      `₹${data.sgst.toFixed(2)}`,
      `₹${data.igst.toFixed(2)}`,
      `₹${(data.taxableAmount + data.cgst + data.sgst + data.igst).toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 20,
      head: [['Month', 'Taxable Amount', 'CGST', 'SGST', 'IGST', 'Total']],
      body: monthlyData,
      theme: 'grid'
    });
    
    return doc;
  }
}; 