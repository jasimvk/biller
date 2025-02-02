import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid,
  useTheme,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Stack,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CloudDone as CloudIcon,
  Support as SupportIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import Footer from '../components/Footer';

function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <ReceiptIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Smart Invoicing',
      description: 'Generate professional GST invoices in seconds with our intelligent billing system'
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Business Analytics',
      description: 'Track your business growth with detailed insights and reports'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Secure & Compliant',
      description: 'GST compliant system with bank-grade security for your data'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Fast Performance',
      description: 'Lightning-fast operations for smooth business management'
    },
    {
      icon: <CloudIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Cloud Storage',
      description: 'Access your data anywhere, anytime with secure cloud storage'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you succeed'
    }
  ];

  // Test data for a valid registration
  const validBusiness = {
    tradeName: "Tech Solutions",
    legalName: "Tech Solutions Pvt Ltd",
    gstin: "27AAPFU0939F1ZV",
    pan: "AAPFU0939F",
    mobile: "9876543210",
    email: "contact@techsolutions.com",
    website: "www.techsolutions.com",
    registeredAddress: {
      building: "Tech Tower",
      street: "IT Park Road",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400001"
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme.palette.background.default
    }}>
      {/* Navigation */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'transparent', boxShadow: 1 }}>
        <Toolbar sx={{ bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
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
          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/businesses')}
              sx={{
                px: 3,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px'
              }}
            >
              View Businesses
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/register')}
              sx={{
                px: 3,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px'
              }}
            >
              Register Business
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          pt: 15,
          pb: 10,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              letterSpacing: '-0.5px'
            }}
          >
            Simplify Your GST Billing
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 6,
              opacity: 0.9,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: 400,
              lineHeight: 1.5
            }}
          >
           The Biller Software is a Unique Self Invoicing Software which helps small and
medium businesses to generate Invoices with GST, Debit Notes, Credit
Notes and Delivery Challans to easily manage their business activities. The
Software provides easy facilitation to enable businesses to file GST Return
and also generate E-Invoices and E-Way Bills in real time.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem'
              }}
            >
              Register Business
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/businesses')}
              sx={{
                color: 'white',
                borderColor: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem'
              }}
            >
              View Businesses
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 10, flex: 1 }} maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 800,
            color: theme.palette.text.primary,
            letterSpacing: '-0.5px'
          }}
        >
          Why Choose Biller?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: '800px', mx: 'auto' }}
        >
          Everything you need to manage your business billing and compliance
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: '12px',
                  border: `1px solid ${theme.palette.grey[200]}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[4],
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      mb: 3,
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '12px',
                      color: theme.palette.primary.main
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}

export default HomePage; 