import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  Grid,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <ReceiptIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Billing',
      description: 'Create and manage GST invoices effortlessly'
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      title: 'Business Management',
      description: 'Manage your business details and customers efficiently'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Compliant',
      description: 'GST compliant billing system with secure data storage'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.background.default
    }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          pt: 8,
          pb: 6,
          background: theme.palette.primary.main,
          borderRadius: 0,
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Biller
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
            sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.9)' }}
          >
            Simple GST Billing Solution for Your Business
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Register Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box sx={{ color: theme.palette.primary.main }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.grey[100]
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Biller. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage; 