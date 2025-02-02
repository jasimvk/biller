import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import {
  Print as PrintIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Invoice() {
  const theme = useTheme();
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'INV-001',
    invoiceDate: new Date().toISOString().split('T')[0],
    business: {
      tradeName: 'PROFESSIONAL ACCOUNTING & TAX CONSULTANTS',
      gstin: '32AJJPT8337M1ZK',
      pan: 'AJJPT8337M',
      address: 'XI/207, A.R Building, Second Floor, Palampadom Junction, Old Boat Jetty Road, Kottayam, Kerala, India, Pin code: 686001',
      udyamNumber: 'UDYAM-KL-07-0022370',
    },
    customer: {
      name: 'Sample Customer',
      gstin: '32AAAAA0000A1Z5',
      address: 'Sample Address, Kerala, 686001',
    },
    items: [
      {
        description: 'Sample Item 1',
        hsn: '998231',
        quantity: 1,
        unit: 'Nos',
        rate: 1000,
        amount: 1000,
        cgst: 90,
        sgst: 90,
        igst: 0,
      },
    ],
    reverseCharge: false,
    placeOfSupply: 'Kerala (32)',
  });

  const calculateTotals = () => {
    const totals = invoiceData.items.reduce((acc, item) => ({
      amount: acc.amount + item.amount,
      cgst: acc.cgst + item.cgst,
      sgst: acc.sgst + item.sgst,
      igst: acc.igst + item.igst,
    }), { amount: 0, cgst: 0, sgst: 0, igst: 0 });

    return {
      ...totals,
      total: totals.amount + totals.cgst + totals.sgst + totals.igst,
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: 4,
    }}>
      <Container maxWidth="md">
        {/* Print/Download buttons - hidden when printing */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, '@media print': { display: 'none' } }}>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print Invoice
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Download PDF
          </Button>
        </Box>

        {/* Invoice Paper */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
            '@media print': { 
              boxShadow: 'none',
              border: 'none',
            }
          }}
        >
          {/* Header */}
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            {invoiceData.business.tradeName}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>GSTIN:</strong> {invoiceData.business.gstin}
              </Typography>
              <Typography variant="body2">
                <strong>PAN:</strong> {invoiceData.business.pan}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>UDYAM Number:</strong> {invoiceData.business.udyamNumber}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" paragraph>
            <strong>Registered Office:</strong> {invoiceData.business.address}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Invoice Details */}
          <Typography variant="h5" align="center" gutterBottom sx={{ textTransform: 'uppercase' }}>
            Tax Invoice
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Invoice Number:</strong> {invoiceData.invoiceNumber}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {invoiceData.invoiceDate}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Reverse Charge:</strong> {invoiceData.reverseCharge ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body2">
                <strong>Place of Supply:</strong> {invoiceData.placeOfSupply}
              </Typography>
            </Grid>
          </Grid>

          {/* Customer Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Bill To:</Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {invoiceData.customer.name}
            </Typography>
            <Typography variant="body2">
              <strong>GSTIN:</strong> {invoiceData.customer.gstin}
            </Typography>
            <Typography variant="body2">
              <strong>Address:</strong> {invoiceData.customer.address}
            </Typography>
          </Box>

          {/* Items Table */}
          <TableContainer sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>HSN/SAC</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">CGST</TableCell>
                  <TableCell align="right">SGST</TableCell>
                  <TableCell align="right">IGST</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.hsn}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">₹{item.rate}</TableCell>
                    <TableCell align="right">₹{item.amount}</TableCell>
                    <TableCell align="right">₹{item.cgst}</TableCell>
                    <TableCell align="right">₹{item.sgst}</TableCell>
                    <TableCell align="right">₹{item.igst}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Table size="small" sx={{ width: 'auto' }}>
              <TableBody>
                {Object.entries(calculateTotals()).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </TableCell>
                    <TableCell align="right">₹{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Terms & Conditions:
            </Typography>
            <Typography variant="body2">
              1. Payment is due within 30 days
            </Typography>
            <Typography variant="body2">
              2. This is a computer generated invoice
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Invoice; 