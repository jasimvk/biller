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
  Tabs,
  Tab,
  Button
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { formatINR } from '../utils/currencyFormatter';
import HSNSummary from './HSNSummary';
import StateWiseGSTSummary from './StateWiseGSTSummary';
import GSTChartAnalysis from './GSTChartAnalysis';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '20px 0' }}>
      {value === index && children}
    </div>
  );
}

function GSTR1Report({ invoices, startDate, endDate, business }) {
  const [tabValue, setTabValue] = React.useState(0);

  // B2B Invoices (Table 4A, 4B, 4C, 6B, 6C)
  const b2bInvoices = invoices.filter(inv => inv.customer_gstin);
  
  // B2C Large Invoices (Table 5A)
  const b2cLargeInvoices = invoices.filter(inv => 
    !inv.customer_gstin && inv.total_amount > 250000
  );
  
  // B2C Small Invoices (Table 7)
  const b2cSmallInvoices = invoices.filter(inv => 
    !inv.customer_gstin && inv.total_amount <= 250000
  );

  const downloadGSTR1 = () => {
    let csvContent = "GSTR-1 Report\n";
    csvContent += `Period: ${startDate} to ${endDate}\n\n`;

    // B2B Invoices
    csvContent += "B2B Invoices\n";
    csvContent += "GSTIN,Invoice Number,Invoice Date,Invoice Value,Place Of Supply,Reverse Charge,Tax Rate,Taxable Value,CGST,SGST,IGST,Total Tax\n";
    b2bInvoices.forEach(inv => {
      inv.items.forEach(item => {
        csvContent += `${inv.customer_gstin},${inv.invoice_number},${inv.invoice_date},${inv.total_amount},${inv.place_of_supply},${inv.reverse_charge ? 'Y' : 'N'},${item.gst_rate},${item.taxable_amount},${item.cgst_amount},${item.sgst_amount},${item.igst_amount},${item.cgst_amount + item.sgst_amount + item.igst_amount}\n`;
      });
    });

    // B2C Large Invoices
    csvContent += "\nB2C Large Invoices\n";
    csvContent += "Invoice Number,Invoice Date,Invoice Value,Place Of Supply,Tax Rate,Taxable Value,CGST,SGST,IGST,Total Tax\n";
    b2cLargeInvoices.forEach(inv => {
      inv.items.forEach(item => {
        csvContent += `${inv.invoice_number},${inv.invoice_date},${inv.total_amount},${inv.place_of_supply},${item.gst_rate},${item.taxable_amount},${item.cgst_amount},${item.sgst_amount},${item.igst_amount},${item.cgst_amount + item.sgst_amount + item.igst_amount}\n`;
      });
    });

    // Add HSN Summary section
    csvContent += "\nHSN Summary\n";
    csvContent += "HSN,Description,UQC,Total Quantity,Total Value,Taxable Value,IGST,CGST,SGST\n";
    
    const hsnSummary = calculateHSNSummary();
    hsnSummary.forEach(row => {
      csvContent += `${row.hsn_code},${row.description},${row.uqc},${row.total_quantity},${row.total_value},${row.taxable_value},${row.igst},${row.cgst},${row.sgst}\n`;
    });

    // Add State-wise Summary section
    csvContent += "\nState-wise Summary\n";
    csvContent += "State Code,State Name,Intra-State Invoices,Intra-State Value,CGST,SGST,Inter-State Invoices,Inter-State Value,IGST\n";
    
    Object.entries(calculateStateSummary()).forEach(([stateCode, data]) => {
      csvContent += `${stateCode},${data.stateName},${data.intraState.count},${data.intraState.taxableValue},${data.intraState.cgst},${data.intraState.sgst},${data.interState.count},${data.interState.taxableValue},${data.interState.igst}\n`;
    });

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSTR1-${startDate}-to-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">GSTR-1 Report</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadGSTR1}
        >
          Download GSTR-1
        </Button>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Period: {startDate} to {endDate}
      </Typography>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="B2B Invoices" />
        <Tab label="B2C Large" />
        <Tab label="B2C Small" />
        <Tab label="HSN Summary" />
        <Tab label="State-wise Summary" />
        <Tab label="Analytics" />
      </Tabs>

      {/* B2B Invoices */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>GSTIN</TableCell>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell>Place of Supply</TableCell>
                <TableCell align="right">Tax Rate</TableCell>
                <TableCell align="right">Taxable Value</TableCell>
                <TableCell align="right">Tax Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {b2bInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.customer_gstin}</TableCell>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{formatINR(invoice.total_amount)}</TableCell>
                  <TableCell>{invoice.place_of_supply}</TableCell>
                  <TableCell align="right">
                    {invoice.items.map(item => `${item.gst_rate}%`).join(', ')}
                  </TableCell>
                  <TableCell align="right">{formatINR(invoice.total_taxable_amount)}</TableCell>
                  <TableCell align="right">
                    {formatINR(invoice.total_cgst + invoice.total_sgst + invoice.total_igst)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* B2C Large Invoices */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell>Place of Supply</TableCell>
                <TableCell align="right">Tax Rate</TableCell>
                <TableCell align="right">Taxable Value</TableCell>
                <TableCell align="right">Tax Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {b2cLargeInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{formatINR(invoice.total_amount)}</TableCell>
                  <TableCell>{invoice.place_of_supply}</TableCell>
                  <TableCell align="right">
                    {invoice.items.map(item => `${item.gst_rate}%`).join(', ')}
                  </TableCell>
                  <TableCell align="right">{formatINR(invoice.total_taxable_amount)}</TableCell>
                  <TableCell align="right">
                    {formatINR(invoice.total_cgst + invoice.total_sgst + invoice.total_igst)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* B2C Small Invoices */}
      <TabPanel value={tabValue} index={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell>Place of Supply</TableCell>
                <TableCell align="right">Tax Rate</TableCell>
                <TableCell align="right">Taxable Value</TableCell>
                <TableCell align="right">Tax Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {b2cSmallInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{formatINR(invoice.total_amount)}</TableCell>
                  <TableCell>{invoice.place_of_supply}</TableCell>
                  <TableCell align="right">
                    {invoice.items.map(item => `${item.gst_rate}%`).join(', ')}
                  </TableCell>
                  <TableCell align="right">{formatINR(invoice.total_taxable_amount)}</TableCell>
                  <TableCell align="right">
                    {formatINR(invoice.total_cgst + invoice.total_sgst + invoice.total_igst)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* HSN Summary */}
      <TabPanel value={tabValue} index={3}>
        <HSNSummary invoices={invoices} />
      </TabPanel>

      {/* State-wise Summary */}
      <TabPanel value={tabValue} index={4}>
        <StateWiseGSTSummary 
          invoices={invoices} 
          businessState={business.gstin.substring(0, 2)} 
        />
      </TabPanel>

      {/* Analytics */}
      <TabPanel value={tabValue} index={5}>
        <GSTChartAnalysis invoices={invoices} />
      </TabPanel>
    </Box>
  );
}

export default GSTR1Report; 