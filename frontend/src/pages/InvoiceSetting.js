import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { ArrowBack, Save, Close as CloseIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InvoicePreview from '../components/InvoicePreview';

function InvoiceSetting() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    prefix: 'PATS',
    startNumber: '00012',
    suffix: '2024-25',
    numberOfZeros: 5,
    invoiceType: 'tax',
    showTransportDetails: true,
    showEwayBill: true,
    showDispatchFrom: false,
    columns: {
      qty: true,
      units: true,
      rate: true,
      discount: true,
      igst: true,
      cgst: true,
      sgst: true,
      cess: true,
      batchNo: false,
      mfgDate: false,
      expDate: false,
      grossWeight: false,
      stoneWeight: false,
      netWeight: false,
      hsnSac: true,
      taxableValue: true,
      taxRate: true,
    },
    bankDetails: {
      show: true,
      accountHolder: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      branch: '',
    },
    declaration: {
      text: 'We hereby declare that this invoice shows the actual price of goods/services described and all the particulars are true & correct.'
    }
  });
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [businessDetails, setBusinessDetails] = useState(null);

  useEffect(() => {
    // Fetch business details for preview
    fetchBusinessDetails();
  }, []);

  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch('your-api-endpoint/business-details');
      const data = await response.json();
      setBusinessDetails(data);
    } catch (error) {
      console.error('Error fetching business details:', error);
    }
  };

  const validateSettings = () => {
    const newErrors = {};

    // Validate prefix
    if (!settings.prefix.trim()) {
      newErrors.prefix = 'Prefix is required';
    }

    // Validate start number
    if (!settings.startNumber.trim()) {
      newErrors.startNumber = 'Start number is required';
    } else if (!/^\d+$/.test(settings.startNumber)) {
      newErrors.startNumber = 'Start number must contain only digits';
    }

    // Validate bank details if shown
    if (settings.bankDetails.show) {
      if (!settings.bankDetails.accountHolder.trim()) {
        newErrors['bankDetails.accountHolder'] = 'Account holder name is required';
      }
      if (!settings.bankDetails.accountNumber.trim()) {
        newErrors['bankDetails.accountNumber'] = 'Account number is required';
      }
      if (!settings.bankDetails.ifscCode.trim()) {
        newErrors['bankDetails.ifscCode'] = 'IFSC code is required';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(settings.bankDetails.ifscCode)) {
        newErrors['bankDetails.ifscCode'] = 'Invalid IFSC code format';
      }
    }

    // Validate number of zeros
    if (settings.numberOfZeros < 0) {
      newErrors.numberOfZeros = 'Number of zeros must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateSettings()) {
      try {
        // API call to save settings
        const response = await fetch('your-api-endpoint/invoice-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        });

        if (response.ok) {
          // Show success message
          alert('Settings saved successfully');
        } else {
          throw new Error('Failed to save settings');
        }
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings');
      }
    }
  };

  const handleColumnToggle = (columnName) => {
    setSettings(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnName]: !prev.columns[columnName]
      }
    }));
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header with Preview button */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" component="h1" fontWeight="600">
              Invoice Settings
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => setShowPreview(true)}
              sx={{ mr: 2 }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Invoice Type Selection */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Invoice Type Setting
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.invoiceType === 'tax'}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      invoiceType: e.target.checked ? 'tax' : 'supply'
                    }))}
                  />
                }
                label="Tax Invoice (Switch off for Bill of Supply)"
              />
            </Paper>
          </Grid>

          {/* Invoice Numbering Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Invoice Numbering Setting
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Prefix"
                    value={settings.prefix}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      prefix: e.target.value
                    }))}
                    helperText="E.g., PATS/"
                    error={!!errors.prefix}
                    helperText={errors.prefix}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Start Invoice Number"
                    value={settings.startNumber}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      startNumber: e.target.value
                    }))}
                    helperText="Number will start from this value"
                    error={!!errors.startNumber}
                    helperText={errors.startNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Suffix"
                    value={settings.suffix}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      suffix: e.target.value
                    }))}
                    helperText="E.g., /2024-25"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Zeros to Prefix"
                    value={settings.numberOfZeros}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      numberOfZeros: parseInt(e.target.value)
                    }))}
                    helperText="E.g., 5 zeros: 00000"
                    error={!!errors.numberOfZeros}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Additional Options */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Additional Options
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showTransportDetails}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          showTransportDetails: e.target.checked
                        }))}
                      />
                    }
                    label="Show Transport Details"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showEwayBill}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          showEwayBill: e.target.checked
                        }))}
                      />
                    }
                    label="Show E-way Bill"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showDispatchFrom}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          showDispatchFrom: e.target.checked
                        }))}
                      />
                    }
                    label="Show Dispatch From"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Column Selection */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Add/Remove Columns to Invoice
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(settings.columns).map(([column, checked]) => (
                  <Grid item xs={12} sm={6} md={4} key={column}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={checked}
                          onChange={() => handleColumnToggle(column)}
                        />
                      }
                      label={column.toUpperCase()}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Bank Details */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Bank Account Details
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.bankDetails.show}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      bankDetails: {
                        ...prev.bankDetails,
                        show: e.target.checked
                      }
                    }))}
                  />
                }
                label="Show Bank Details on Invoice"
                sx={{ mb: 2 }}
              />
              {settings.bankDetails.show && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Holder Name"
                      value={settings.bankDetails.accountHolder}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          accountHolder: e.target.value
                        }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={settings.bankDetails.accountNumber}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          accountNumber: e.target.value
                        }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      value={settings.bankDetails.bankName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          bankName: e.target.value
                        }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="IFSC Code"
                      value={settings.bankDetails.ifscCode}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          ifscCode: e.target.value
                        }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Branch"
                      value={settings.bankDetails.branch}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          branch: e.target.value
                        }
                      }))}
                    />
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Declaration Text */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Declaration Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={settings.declaration.text}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  declaration: {
                    ...prev.declaration,
                    text: e.target.value
                  }
                }))}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Preview Dialog */}
        <Dialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Invoice Preview
              <IconButton onClick={() => setShowPreview(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <InvoicePreview settings={settings} businessDetails={businessDetails} />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default InvoiceSetting; 