import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import InvoiceTemplate from './InvoiceTemplate';

function InvoicePreview({ open, onClose, invoice, business, customer, settings, businessDetails }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = document.querySelector('.invoice-template').cloneNode(true);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .invoice-template { box-shadow: none; }
              .MuiPaper-root { box-shadow: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const sampleItem = {
    description: 'Sample Item',
    hsn: '12345',
    qty: '1',
    units: 'PCS',
    rate: '1000.00',
    discount: '100.00',
    taxableValue: '900.00',
    igst: '90.00',
    cgst: '45.00',
    sgst: '45.00',
    cess: '0.00',
    total: '990.00',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '90vh' }
      }}
    >
      <DialogContent>
        <Paper sx={{ p: 3, bgcolor: '#fff' }}>
          {/* Header */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">{businessDetails?.tradeName || 'TRADE NAME'}</Typography>
              <Typography variant="body2">{businessDetails?.address?.building || 'Address Line 1'}</Typography>
              <Typography variant="body2">GSTIN: {businessDetails?.gstin || 'GSTIN'}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6">TAX INVOICE</Typography>
              <Typography variant="body2">
                Invoice No: {settings.prefix}{settings.startNumber}{settings.suffix}
              </Typography>
              <Typography variant="body2">Date: {new Date().toLocaleDateString()}</Typography>
            </Box>
          </Box>

          {/* Bill To / Ship To */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Bill To:</Typography>
              <Typography variant="body2">Customer Name</Typography>
              <Typography variant="body2">Address Line 1</Typography>
              <Typography variant="body2">GSTIN: 12XXXXX1234X1XX</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Ship To:</Typography>
              <Typography variant="body2">Same as billing address</Typography>
            </Grid>
          </Grid>

          {/* Items Table */}
          <TableContainer sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>HSN/SAC</TableCell>
                  {settings.columns.qty && <TableCell>Qty</TableCell>}
                  {settings.columns.units && <TableCell>Units</TableCell>}
                  {settings.columns.rate && <TableCell>Rate</TableCell>}
                  {settings.columns.discount && <TableCell>Discount</TableCell>}
                  <TableCell>Taxable Value</TableCell>
                  {settings.columns.igst && <TableCell>IGST</TableCell>}
                  {settings.columns.cgst && <TableCell>CGST</TableCell>}
                  {settings.columns.sgst && <TableCell>SGST</TableCell>}
                  {settings.columns.cess && <TableCell>CESS</TableCell>}
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{sampleItem.description}</TableCell>
                  <TableCell>{sampleItem.hsn}</TableCell>
                  {settings.columns.qty && <TableCell>{sampleItem.qty}</TableCell>}
                  {settings.columns.units && <TableCell>{sampleItem.units}</TableCell>}
                  {settings.columns.rate && <TableCell>{sampleItem.rate}</TableCell>}
                  {settings.columns.discount && <TableCell>{sampleItem.discount}</TableCell>}
                  <TableCell>{sampleItem.taxableValue}</TableCell>
                  {settings.columns.igst && <TableCell>{sampleItem.igst}</TableCell>}
                  {settings.columns.cgst && <TableCell>{sampleItem.cgst}</TableCell>}
                  {settings.columns.sgst && <TableCell>{sampleItem.sgst}</TableCell>}
                  {settings.columns.cess && <TableCell>{sampleItem.cess}</TableCell>}
                  <TableCell>{sampleItem.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Bank Details */}
          {settings.bankDetails.show && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Bank Account Details:</Typography>
              <Typography variant="body2">Account Holder: {settings.bankDetails.accountHolder}</Typography>
              <Typography variant="body2">Account Number: {settings.bankDetails.accountNumber}</Typography>
              <Typography variant="body2">Bank: {settings.bankDetails.bankName}</Typography>
              <Typography variant="body2">IFSC: {settings.bankDetails.ifscCode}</Typography>
              <Typography variant="body2">Branch: {settings.bankDetails.branch}</Typography>
            </Box>
          )}

          {/* Declaration */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              {settings.declaration.text}
            </Typography>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={handlePrint} color="primary">
          <PrintIcon />
        </IconButton>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default InvoicePreview; 