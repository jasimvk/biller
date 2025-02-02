import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button
} from '@mui/material';
import { formatINR } from '../utils/currencyFormatter';
import { Download as DownloadIcon } from '@mui/icons-material';

function GSTSummaryReport({ invoices, startDate, endDate }) {
  const calculateTotals = () => {
    return invoices.reduce((acc, invoice) => ({
      taxableAmount: acc.taxableAmount + invoice.total_taxable_amount,
      cgst: acc.cgst + invoice.total_cgst,
      sgst: acc.sgst + invoice.total_sgst,
      igst: acc.igst + invoice.total_igst,
      total: acc.total + invoice.total_amount,
      count: acc.count + 1
    }), {
      taxableAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0,
      count: 0
    });
  };

  const calculateGSTRateWise = () => {
    const rateWiseSummary = {};
    
    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const rateKey = `${item.gst_rate}%`;
        if (!rateWiseSummary[rateKey]) {
          rateWiseSummary[rateKey] = {
            taxableAmount: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
            total: 0
          };
        }
        
        rateWiseSummary[rateKey].taxableAmount += item.taxable_amount;
        rateWiseSummary[rateKey].cgst += item.cgst_amount;
        rateWiseSummary[rateKey].sgst += item.sgst_amount;
        rateWiseSummary[rateKey].igst += item.igst_amount;
        rateWiseSummary[rateKey].total += item.total_amount;
      });
    });

    return rateWiseSummary;
  };

  const downloadCSV = () => {
    const totals = calculateTotals();
    const rateWiseSummary = calculateGSTRateWise();
    
    let csvContent = "GST Summary Report\n";
    csvContent += `Period: ${startDate} to ${endDate}\n\n`;
    
    // Overall Summary
    csvContent += "Overall Summary\n";
    csvContent += "Total Invoices,Taxable Amount,CGST,SGST,IGST,Total Amount\n";
    csvContent += `${totals.count},${totals.taxableAmount},${totals.cgst},${totals.sgst},${totals.igst},${totals.total}\n\n`;
    
    // Rate-wise Summary
    csvContent += "Rate-wise Summary\n";
    csvContent += "GST Rate,Taxable Amount,CGST,SGST,IGST,Total Amount\n";
    Object.entries(rateWiseSummary).forEach(([rate, values]) => {
      csvContent += `${rate},${values.taxableAmount},${values.cgst},${values.sgst},${values.igst},${values.total}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gst-summary-${startDate}-to-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const totals = calculateTotals();
  const rateWiseSummary = calculateGSTRateWise();

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">GST Summary Report</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadCSV}
        >
          Download CSV
        </Button>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Period: {startDate} to {endDate}
      </Typography>

      {/* Overall Summary */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Overall Summary</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Total Invoices</TableCell>
              <TableCell align="right">Taxable Amount</TableCell>
              <TableCell align="right">CGST</TableCell>
              <TableCell align="right">SGST</TableCell>
              <TableCell align="right">IGST</TableCell>
              <TableCell align="right">Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{totals.count}</TableCell>
              <TableCell align="right">{formatINR(totals.taxableAmount)}</TableCell>
              <TableCell align="right">{formatINR(totals.cgst)}</TableCell>
              <TableCell align="right">{formatINR(totals.sgst)}</TableCell>
              <TableCell align="right">{formatINR(totals.igst)}</TableCell>
              <TableCell align="right">{formatINR(totals.total)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rate-wise Summary */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Rate-wise Summary</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>GST Rate</TableCell>
              <TableCell align="right">Taxable Amount</TableCell>
              <TableCell align="right">CGST</TableCell>
              <TableCell align="right">SGST</TableCell>
              <TableCell align="right">IGST</TableCell>
              <TableCell align="right">Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(rateWiseSummary).map(([rate, values]) => (
              <TableRow key={rate}>
                <TableCell>{rate}</TableCell>
                <TableCell align="right">{formatINR(values.taxableAmount)}</TableCell>
                <TableCell align="right">{formatINR(values.cgst)}</TableCell>
                <TableCell align="right">{formatINR(values.sgst)}</TableCell>
                <TableCell align="right">{formatINR(values.igst)}</TableCell>
                <TableCell align="right">{formatINR(values.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default GSTSummaryReport; 