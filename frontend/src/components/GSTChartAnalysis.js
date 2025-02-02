import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatINR } from '../utils/currencyFormatter';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function GSTChartAnalysis({ invoices }) {
  const getMonthlyData = () => {
    const monthlyData = {};
    invoices.forEach(invoice => {
      const month = new Date(invoice.invoice_date).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: 0
        };
      }
      monthlyData[month].cgst += invoice.total_cgst;
      monthlyData[month].sgst += invoice.total_sgst;
      monthlyData[month].igst += invoice.total_igst;
      monthlyData[month].total += invoice.total_amount;
    });
    return Object.values(monthlyData);
  };

  const getGSTDistribution = () => {
    const total = invoices.reduce((acc, inv) => ({
      cgst: acc.cgst + inv.total_cgst,
      sgst: acc.sgst + inv.total_sgst,
      igst: acc.igst + inv.total_igst
    }), { cgst: 0, sgst: 0, igst: 0 });

    return [
      { name: 'CGST', value: total.cgst },
      { name: 'SGST', value: total.sgst },
      { name: 'IGST', value: total.igst }
    ];
  };

  const getRateWiseData = () => {
    const rateData = {};
    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const rate = `${item.gst_rate}%`;
        if (!rateData[rate]) {
          rateData[rate] = {
            rate,
            amount: 0,
            count: 0
          };
        }
        rateData[rate].amount += item.taxable_amount;
        rateData[rate].count++;
      });
    });
    return Object.values(rateData);
  };

  const monthlyData = getMonthlyData();
  const gstDistribution = getGSTDistribution();
  const rateWiseData = getRateWiseData();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Monthly Trend */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Monthly GST Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatINR(value)} />
                  <Tooltip formatter={(value) => formatINR(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="cgst" stroke="#8884d8" name="CGST" />
                  <Line type="monotone" dataKey="sgst" stroke="#82ca9d" name="SGST" />
                  <Line type="monotone" dataKey="igst" stroke="#ffc658" name="IGST" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* GST Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>GST Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gstDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${formatINR(value)}`}
                  >
                    {gstDistribution.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatINR(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Rate-wise Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Rate-wise Analysis</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rateWiseData}>
                  <XAxis dataKey="rate" />
                  <YAxis yAxisId="left" tickFormatter={(value) => formatINR(value)} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [
                    name === 'amount' ? formatINR(value) : value,
                    name === 'amount' ? 'Taxable Amount' : 'Transaction Count'
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="amount" fill="#8884d8" name="Taxable Amount" />
                  <Bar yAxisId="right" dataKey="count" fill="#82ca9d" name="Transaction Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GSTChartAnalysis; 