import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid
} from '@mui/material';
import { formatINR } from '../utils/currencyFormatter';

const statesList = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '36': 'Telangana',
  '37': 'Andhra Pradesh'
};

function StateWiseGSTSummary({ invoices, businessState }) {
  const calculateStateSummary = () => {
    const stateSummary = {};

    invoices.forEach(invoice => {
      const stateCode = invoice.place_of_supply.substring(0, 2);
      if (!stateSummary[stateCode]) {
        stateSummary[stateCode] = {
          stateName: statesList[stateCode] || 'Other',
          intraState: {
            count: 0,
            taxableValue: 0,
            cgst: 0,
            sgst: 0
          },
          interState: {
            count: 0,
            taxableValue: 0,
            igst: 0
          }
        };
      }

      const isIntraState = stateCode === businessState.substring(0, 2);
      const summary = stateSummary[stateCode];

      if (isIntraState) {
        summary.intraState.count++;
        summary.intraState.taxableValue += invoice.total_taxable_amount;
        summary.intraState.cgst += invoice.total_cgst;
        summary.intraState.sgst += invoice.total_sgst;
      } else {
        summary.interState.count++;
        summary.interState.taxableValue += invoice.total_taxable_amount;
        summary.interState.igst += invoice.total_igst;
      }
    });

    return stateSummary;
  };

  const stateSummary = calculateStateSummary();

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>State-wise GST Summary</Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>State</TableCell>
              <TableCell align="center" colSpan={4}>Intra-State Supply</TableCell>
              <TableCell align="center" colSpan={3}>Inter-State Supply</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell align="right">No. of Invoices</TableCell>
              <TableCell align="right">Taxable Value</TableCell>
              <TableCell align="right">CGST</TableCell>
              <TableCell align="right">SGST</TableCell>
              <TableCell align="right">No. of Invoices</TableCell>
              <TableCell align="right">Taxable Value</TableCell>
              <TableCell align="right">IGST</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(stateSummary).map(([stateCode, data]) => (
              <TableRow key={stateCode}>
                <TableCell>
                  {stateCode} - {data.stateName}
                </TableCell>
                <TableCell align="right">{data.intraState.count}</TableCell>
                <TableCell align="right">{formatINR(data.intraState.taxableValue)}</TableCell>
                <TableCell align="right">{formatINR(data.intraState.cgst)}</TableCell>
                <TableCell align="right">{formatINR(data.intraState.sgst)}</TableCell>
                <TableCell align="right">{data.interState.count}</TableCell>
                <TableCell align="right">{formatINR(data.interState.taxableValue)}</TableCell>
                <TableCell align="right">{formatINR(data.interState.igst)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Summary</Typography>
          <Box sx={{ pl: 2 }}>
            <Typography>
              Total States: {Object.keys(stateSummary).length}
            </Typography>
            <Typography>
              Intra-State Transactions: {
                Object.values(stateSummary).reduce((acc, curr) => acc + curr.intraState.count, 0)
              }
            </Typography>
            <Typography>
              Inter-State Transactions: {
                Object.values(stateSummary).reduce((acc, curr) => acc + curr.interState.count, 0)
              }
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Total Tax</Typography>
          <Box sx={{ pl: 2 }}>
            <Typography>
              Total CGST: {formatINR(
                Object.values(stateSummary).reduce((acc, curr) => acc + curr.intraState.cgst, 0)
              )}
            </Typography>
            <Typography>
              Total SGST: {formatINR(
                Object.values(stateSummary).reduce((acc, curr) => acc + curr.intraState.sgst, 0)
              )}
            </Typography>
            <Typography>
              Total IGST: {formatINR(
                Object.values(stateSummary).reduce((acc, curr) => acc + curr.interState.igst, 0)
              )}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StateWiseGSTSummary; 