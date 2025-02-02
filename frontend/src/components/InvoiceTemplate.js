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
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { numberToWords } from '../utils/numberToWords';
import { formatINR, formatIndianNumber } from '../utils/currencyFormatter';

function InvoiceTemplate({ invoice, business, customer, printMode = false }) {
  const containerStyles = printMode ? {
    padding: '40px',
    backgroundColor: 'white',
    color: 'black'
  } : {
    padding: '20px',
    margin: '20px'
  };

  return (
    <Box component={Paper} sx={containerStyles} className="invoice-template">
      {/* Header */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom>{business.tradeName}</Typography>
          <Typography variant="body2">
            {JSON.parse(business.registeredAddress).building}<br />
            {JSON.parse(business.registeredAddress).street}<br />
            {JSON.parse(business.registeredAddress).city}, {JSON.parse(business.registeredAddress).state}<br />
            {JSON.parse(business.registeredAddress).pinCode}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            GSTIN: {business.gstin}<br />
            Phone: {business.mobile}<br />
            Email: {business.email}
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>TAX INVOICE</Typography>
          <Typography variant="body2">
            Invoice No: {invoice.invoice_number}<br />
            Date: {format(new Date(invoice.invoice_date), 'dd/MM/yyyy')}<br />
            Due Date: {format(new Date(invoice.due_date), 'dd/MM/yyyy')}
          </Typography>
        </Grid>
      </Grid>

      {/* Bill To Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>Bill To:</Typography>
          <Typography variant="body2">
            {customer.name}<br />
            {JSON.parse(customer.billing_address).building}<br />
            {JSON.parse(customer.billing_address).street}<br />
            {JSON.parse(customer.billing_address).city}, {JSON.parse(customer.billing_address).state}<br />
            {JSON.parse(customer.billing_address).pinCode}
          </Typography>
          {customer.gstin && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              GSTIN: {customer.gstin}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>Ship To:</Typography>
          <Typography variant="body2">
            {customer.name}<br />
            {JSON.parse(customer.shipping_address || customer.billing_address).building}<br />
            {JSON.parse(customer.shipping_address || customer.billing_address).street}<br />
            {JSON.parse(customer.shipping_address || customer.billing_address).city}, 
            {JSON.parse(customer.shipping_address || customer.billing_address).state}<br />
            {JSON.parse(customer.shipping_address || customer.billing_address).pinCode}
          </Typography>
        </Grid>
      </Grid>

      {/* Items Table */}
      <TableContainer sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>HSN/SAC</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">Taxable Value</TableCell>
              <TableCell align="right">CGST</TableCell>
              <TableCell align="right">SGST</TableCell>
              <TableCell align="right">IGST</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.hsn_code}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{formatINR(item.unit_price)}</TableCell>
                <TableCell align="right">{formatINR(item.taxable_amount)}</TableCell>
                <TableCell align="right">
                  {item.cgst_rate}%<br />
                  {formatINR(item.cgst_amount)}
                </TableCell>
                <TableCell align="right">
                  {item.sgst_rate}%<br />
                  {formatINR(item.sgst_amount)}
                </TableCell>
                <TableCell align="right">
                  {item.igst_rate}%<br />
                  {formatINR(item.igst_amount)}
                </TableCell>
                <TableCell align="right">{formatINR(item.total_amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary */}
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Amount in Words:<br />
              {numberToWords(invoice.total_amount)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" gutterBottom>Bank Details:</Typography>
            <Typography variant="body2">
              Bank Name: YOUR BANK NAME<br />
              A/C No: YOUR ACCOUNT NUMBER<br />
              IFSC Code: YOUR IFSC CODE<br />
              Branch: YOUR BRANCH
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box sx={{ borderLeft: 1, borderColor: 'divider', pl: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={8}><Typography>Taxable Amount:</Typography></Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography>{formatINR(invoice.total_taxable_amount)}</Typography>
              </Grid>
              <Grid item xs={8}><Typography>CGST:</Typography></Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography>{formatINR(invoice.total_cgst)}</Typography>
              </Grid>
              <Grid item xs={8}><Typography>SGST:</Typography></Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography>{formatINR(invoice.total_sgst)}</Typography>
              </Grid>
              <Grid item xs={8}><Typography>IGST:</Typography></Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography>{formatINR(invoice.total_igst)}</Typography>
              </Grid>
              <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
              <Grid item xs={8}><Typography variant="h6">Total:</Typography></Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="h6">{formatINR(invoice.total_amount)}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Terms and Signature */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={6}>
          <Typography variant="body2" gutterBottom>Terms & Conditions:</Typography>
          <Typography variant="body2">
            1. Payment is due within {invoice.payment_terms || 30} days<br />
            2. Goods once sold will not be taken back<br />
            3. Interest will be charged at 18% PA if payment is delayed
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2">For {business.tradeName}</Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2">Authorized Signatory</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default InvoiceTemplate; 