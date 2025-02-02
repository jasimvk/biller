import React, { useState, useEffect } from 'react';
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
  Button,
  ButtonGroup,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { GSTUtils } from '../utils/gstUtils';
import { useDataFetching } from '../hooks/useDataFetching';
import { PDFExport } from '../utils/pdfExport';
import {
  FilterList as FilterIcon,
  Sort as SortIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function GSTReport() {
  const { data: invoices, loading, error } = useDataFetching('invoices');
  const [gstSummary, setGstSummary] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [chartData, setChartData] = useState({ monthly: [], rateWise: [], stateWise: [] });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    gstRate: 'all',
    state: 'all'
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  const [filteredData, setFilteredData] = useState(null);
  const { data: businessData } = useDataFetching('business');

  useEffect(() => {
    if (invoices) {
      const summary = GSTUtils.generateGSTSummary(invoices);
      setGstSummary(summary);
      
      // Prepare chart data
      setChartData({
        monthly: Object.entries(summary.monthWiseSummary).map(([month, data]) => ({
          name: month,
          taxable: data.taxableAmount,
          cgst: data.cgst,
          sgst: data.sgst,
          igst: data.igst
        })),
        rateWise: Object.entries(summary.rateWiseSummary).map(([rate, data]) => ({
          name: rate,
          value: data.taxableAmount
        })),
        stateWise: Object.entries(summary.stateWiseSummary).map(([state, data]) => ({
          name: state,
          value: data.taxableAmount + data.cgst + data.sgst + data.igst
        }))
      });
    }
  }, [invoices]);

  useEffect(() => {
    if (gstSummary) {
      let filtered = { ...gstSummary };

      // Apply filters
      if (filters.startDate || filters.endDate) {
        filtered = filterByDateRange(filtered, filters.startDate, filters.endDate);
      }
      if (filters.minAmount || filters.maxAmount) {
        filtered = filterByAmount(filtered, filters.minAmount, filters.maxAmount);
      }
      if (filters.gstRate !== 'all') {
        filtered = filterByGSTRate(filtered, filters.gstRate);
      }
      if (filters.state !== 'all') {
        filtered = filterByState(filtered, filters.state);
      }

      // Apply sorting
      filtered = sortData(filtered, sortConfig);

      setFilteredData(filtered);
    }
  }, [gstSummary, filters, sortConfig]);

  const handleExport = async (format) => {
    if (!gstSummary) return;

    try {
      if (format === 'pdf') {
        const doc = PDFExport.generateGSTReport(filteredData || gstSummary, businessData);
        doc.save(`gst-report-${new Date().toISOString().split('T')[0]}.pdf`);
      } else {
        const report = await GSTUtils.exportGSTReport(filteredData || gstSummary, format);
        const blob = new Blob([report], { 
          type: format === 'csv' ? 'text/csv' : 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gst-report-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!gstSummary) return <Typography>No data available</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">GST Report</Typography>
        <ButtonGroup>
          <Button onClick={() => handleExport('json')}>Export JSON</Button>
          <Button onClick={() => handleExport('csv')}>Export CSV</Button>
          <Button onClick={() => handleExport('gstr1')}>Export GSTR-1</Button>
          <Button onClick={() => handleExport('pdf')} startIcon={<PdfIcon />}>
            Export PDF
          </Button>
        </ButtonGroup>
      </Box>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Summary" />
        <Tab label="Charts" />
        <Tab label="Details" />
      </Tabs>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          type="date"
          label="Start Date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="End Date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="number"
          label="Min Amount"
          value={filters.minAmount}
          onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
        />
        <TextField
          type="number"
          label="Max Amount"
          value={filters.maxAmount}
          onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>GST Rate</InputLabel>
          <Select
            value={filters.gstRate}
            onChange={(e) => setFilters({ ...filters, gstRate: e.target.value })}
            label="GST Rate"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="5">5%</MenuItem>
            <MenuItem value="12">12%</MenuItem>
            <MenuItem value="18">18%</MenuItem>
            <MenuItem value="28">28%</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Total Tax</Typography>
                <Typography variant="h5">
                  ₹{(gstSummary.totalCGST + gstSummary.totalSGST + gstSummary.totalIGST).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Add more summary cards */}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Monthly GST Collection</Typography>
              <BarChart width={500} height={300} data={chartData.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="cgst" fill="#8884d8" />
                <Bar dataKey="sgst" fill="#82ca9d" />
                <Bar dataKey="igst" fill="#ffc658" />
              </BarChart>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>GST Rate Distribution</Typography>
              <PieChart width={500} height={300}>
                <Pie
                  data={chartData.rateWise}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.rateWise.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell align="right">Taxable Amount</TableCell>
                <TableCell align="right">CGST</TableCell>
                <TableCell align="right">SGST</TableCell>
                <TableCell align="right">IGST</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartData.monthly.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">₹{row.taxable.toFixed(2)}</TableCell>
                  <TableCell align="right">₹{row.cgst.toFixed(2)}</TableCell>
                  <TableCell align="right">₹{row.sgst.toFixed(2)}</TableCell>
                  <TableCell align="right">₹{row.igst.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    ₹{(row.taxable + row.cgst + row.sgst + row.igst).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default GSTReport; 