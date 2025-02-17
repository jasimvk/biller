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
  Divider,
} from '@mui/material';

function InvoicePreview({ settings, businessDetails }) {
  const getFormattedInvoiceNumber = () => {
    const zeros = '0'.repeat(settings.numberOfZeros);
    const number = settings.startNumber.padStart(settings.numberOfZeros, '0');
    return `${settings.prefix}${number}${settings.suffix}`;
  };

  return (
    <Paper sx={{ p: 4, minHeight: '842px', width: '100%' }}>
      {/* Header Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={8}>
          <Typography variant="h4" gutterBottom>
            {businessDetails?.businessName || 'Business Name'}
          </Typography>
          <Typography variant="body2">
            {businessDetails?.address || 'Business Address'}
          </Typography>
          <Typography variant="body2">
            GSTIN: {businessDetails?.gstin || 'GSTIN Number'}
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: 'right' }}>
          {/* Logo placeholder */}
          <Box sx={{ width: 100, height: 100, bgcolor: 'grey.200', ml: 'auto' }}>
            Logo
          </Box>
        </Grid>
      </Grid>

      {/* Invoice Title and Details */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {settings.invoiceType === 'tax' ? 'TAX INVOICE' : 'BILL OF SUPPLY'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography>Invoice No: {getFormattedInvoiceNumber()}</Typography>
            <Typography>Date: {new Date().toLocaleDateString()}</Typography>
          </Grid>
          {settings.showTransportDetails && (
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography>Vehicle No/Transporter ID: _______________</Typography>
              {settings.showEwayBill && (
                <Typography>E-way Bill No: _______________</Typography>
              )}
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Billing Details */}
      <Grid container spacing={4} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Bill To:</Typography>
          <Typography>Customer Name</Typography>
          <Typography>Address:</Typography>
          <Typography>State: _______ Pincode: _______</Typography>
          <Typography>GSTIN: ______________</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Ship To:</Typography>
          <Typography>Customer Name</Typography>
          <Typography>Address:</Typography>
          <Typography>State: _______ Pincode: _______</Typography>
          <Typography>GSTIN: ______________</Typography>
        </Grid>
        {settings.showDispatchFrom && (
          <Grid item xs={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Dispatch From:</Typography>
            <Typography>{businessDetails?.principalPlace || 'Principal Place of Business'}</Typography>
          </Grid>
        )}
      </Grid>

      {/* Items Table */}
      <TableContainer sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>DESCRIPTION OF GOODS</TableCell>
              {settings.columns.hsnSac && <TableCell>HSN/SAC</TableCell>}
              {settings.columns.qty && <TableCell>QTY</TableCell>}
              {settings.columns.units && <TableCell>UQC</TableCell>}
              {settings.columns.rate && <TableCell>RATE</TableCell>}
              {settings.columns.discount && <TableCell>DISCOUNT</TableCell>}
              {settings.columns.taxableValue && <TableCell>TAXABLE VALUE</TableCell>}
              {settings.columns.taxRate && <TableCell>TAX RATE</TableCell>}
              {settings.invoiceType === 'tax' && (
                <>
                  {settings.columns.igst && <TableCell>IGST</TableCell>}
                  {settings.columns.cgst && <TableCell>CGST</TableCell>}
                  {settings.columns.sgst && <TableCell>SGST</TableCell>}
                  {settings.columns.cess && <TableCell>CESS</TableCell>}
                </>
              )}
              <TableCell>TOTAL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={12} align="center">Sample Item</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Amount in Words */}
      <Typography sx={{ mb: 3 }}>
        Amount in Words: _________________________________________________
      </Typography>

      {settings.invoiceType === 'tax' && (
        <>
          {/* Tax Summary Table */}
          <TableContainer sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>HSN/SAC</TableCell>
                  <TableCell>TAXABLE VALUE</TableCell>
                  <TableCell colSpan={2}>INTEGRATED TAX</TableCell>
                  <TableCell colSpan={2}>CENTRAL TAX</TableCell>
                  <TableCell colSpan={2}>STATE TAX</TableCell>
                  <TableCell>TOTAL TAX AMOUNT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} align="center">Tax Summary</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography sx={{ mb: 3 }}>
            Tax Amount in Words: _________________________________________________
          </Typography>
        </>
      )}

      {/* Footer Section */}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          {/* Declaration */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Declaration:</Typography>
          <Typography variant="body2">
            {settings.declaration.text}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          {settings.bankDetails.show && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Bank Account Details:</Typography>
              <Typography variant="body2">Account Holder: {settings.bankDetails.accountHolder}</Typography>
              <Typography variant="body2">Account Number: {settings.bankDetails.accountNumber}</Typography>
              <Typography variant="body2">Bank Name: {settings.bankDetails.bankName}</Typography>
              <Typography variant="body2">IFSC Code: {settings.bankDetails.ifscCode}</Typography>
              <Typography variant="body2">Branch: {settings.bankDetails.branch}</Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Signature */}
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography>For {businessDetails?.businessName || 'Business Name'}</Typography>
        <Box sx={{ height: 60 }} /> {/* Space for signature */}
        <Typography>Authorized Signatory</Typography>
      </Box>

      {/* Footer Note */}
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        THIS IS A COMPUTER GENERATED INVOICE
      </Typography>
    </Paper>
  );
}

export default InvoicePreview; 