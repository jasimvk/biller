import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress
} from '@mui/material';
import GSTSummaryReport from '../components/GSTSummaryReport';

function GSTReports() {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/invoices/report?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      const data = await response.json();
      setInvoices(data.invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field) => (event) => {
    setDateRange(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            type="date"
            label="Start Date"
            value={dateRange.startDate}
            onChange={handleDateChange('startDate')}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            type="date"
            label="End Date"
            value={dateRange.endDate}
            onChange={handleDateChange('endDate')}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            onClick={fetchInvoices}
            fullWidth
            sx={{ height: '56px' }}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : invoices.length > 0 ? (
        <GSTSummaryReport
          invoices={invoices}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        />
      ) : null}
    </Box>
  );
}

export default GSTReports; 