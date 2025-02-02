import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { formatINR } from '../utils/currencyFormatter';

function HSNSummary({ invoices }) {
  const calculateHSNSummary = () => {
    const hsnMap = new Map();

    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const key = `${item.hsn_code}`;
        if (!hsnMap.has(key)) {
          hsnMap.set(key, {
            hsn_code: item.hsn_code,
            description: item.product_name,
            uqc: 'NOS', // Unit of Measurement
            total_quantity: 0,
            total_value: 0,
            taxable_value: 0,
            igst: 0,
            cgst: 0,
            sgst: 0
          });
        }

        const summary = hsnMap.get(key);
        summary.total_quantity += item.quantity;
        summary.total_value += item.total_amount;
        summary.taxable_value += item.taxable_amount;
        summary.igst += item.igst_amount;
        summary.cgst += item.cgst_amount;
        summary.sgst += item.sgst_amount;
      });
    });

    return Array.from(hsnMap.values());
  };

  const hsnSummary = calculateHSNSummary();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>HSN Summary</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>HSN</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">UQC</TableCell>
              <TableCell align="right">Total Quantity</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="right">Taxable Value</TableCell>
              <TableCell align="right">IGST</TableCell>
              <TableCell align="right">CGST</TableCell>
              <TableCell align="right">SGST</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hsnSummary.map((row) => (
              <TableRow key={row.hsn_code}>
                <TableCell>{row.hsn_code}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="right">{row.uqc}</TableCell>
                <TableCell align="right">{row.total_quantity}</TableCell>
                <TableCell align="right">{formatINR(row.total_value)}</TableCell>
                <TableCell align="right">{formatINR(row.taxable_value)}</TableCell>
                <TableCell align="right">{formatINR(row.igst)}</TableCell>
                <TableCell align="right">{formatINR(row.cgst)}</TableCell>
                <TableCell align="right">{formatINR(row.sgst)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default HSNSummary; 