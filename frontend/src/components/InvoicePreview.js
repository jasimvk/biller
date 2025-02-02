import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import InvoiceTemplate from './InvoiceTemplate';

function InvoicePreview({ open, onClose, invoice, business, customer }) {
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
        <InvoiceTemplate
          invoice={invoice}
          business={business}
          customer={customer}
        />
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