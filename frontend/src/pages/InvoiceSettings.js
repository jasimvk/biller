import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  useTheme,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function InvoiceSettings() {
  const theme = useTheme();
  const navigate = useNavigate();

  // Sample invoice format state
  const [invoiceFormat, setInvoiceFormat] = useState({
    showUdyam: true,
    showBranch: true,
    showGodown: true,
    reverseCharge: false,
  });

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      {/* Navigation */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'grey.200' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: theme.palette.primary.main, 
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            BILLER
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              fontWeight: 500,
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Back to Home
          </Button>
        </Toolbar>
      </AppBar>

      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(120deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          pt: 15,
          pb: 8,
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ position: 'relative' }}>
            <SettingsIcon sx={{ fontSize: 56, mb: 3, opacity: 0.9 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              Invoice Settings
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                fontWeight: 400
              }}
            >
              Configure your GST invoice format and settings
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Invoice Format Preview */}
      <Container maxWidth="lg" sx={{ mt: -6, mb: 8, position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'grey.100'
          }}
        >
          {/* Company Details Section */}
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
            {/* Trade Name will be displayed here */}
            PROFESSIONAL ACCOUNTING & TAX CONSULTANTS
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>GSTIN:</strong> 32AJJPT8337M1ZK
              </Typography>
              <Typography variant="body2">
                <strong>PAN:</strong> AJJPT8337M
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" gutterBottom>
            <strong>Registered Office:</strong> XI/207, A.R Building, Second Floor, Palampadom Junction,
            Old Boat Jetty Road, Kottayam, Kerala, India, Pin code: 686001
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Invoice Details */}
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', textTransform: 'uppercase' }}>
            Tax Invoice
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                variant="outlined"
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Invoice Date"
                type="date"
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={invoiceFormat.reverseCharge}
                    onChange={(e) => setInvoiceFormat(prev => ({
                      ...prev,
                      reverseCharge: e.target.checked
                    }))}
                  />
                }
                label="Reverse Charge"
              />
            </Grid>
          </Grid>

          {/* Optional Sections */}
          {invoiceFormat.showUdyam && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>UDYAM Registration Number:</strong> UDYAM-KL-07-0022370
            </Typography>
          )}

          {invoiceFormat.showBranch && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Branch:</strong> Same as registered office
            </Typography>
          )}

          {invoiceFormat.showGodown && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Godown:</strong> Same as registered office
            </Typography>
          )}

          {/* Settings Controls */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Optional Fields
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={invoiceFormat.showUdyam}
                      onChange={(e) => setInvoiceFormat(prev => ({
                        ...prev,
                        showUdyam: e.target.checked
                      }))}
                    />
                  }
                  label="Show UDYAM Number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={invoiceFormat.showBranch}
                      onChange={(e) => setInvoiceFormat(prev => ({
                        ...prev,
                        showBranch: e.target.checked
                      }))}
                    />
                  }
                  label="Show Branch Address"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={invoiceFormat.showGodown}
                      onChange={(e) => setInvoiceFormat(prev => ({
                        ...prev,
                        showGodown: e.target.checked
                      }))}
                    />
                  }
                  label="Show Godown Address"
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
}

export default InvoiceSettings; 