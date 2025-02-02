import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
  useTheme,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  VerifiedUser as VerifiedIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function BusinessList() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/business');
      if (!response.ok) throw new Error('Failed to fetch businesses');
      const data = await response.json();
      setBusinesses(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business =>
    business.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.gstin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderBusinessCard = (business) => (
    <Grid item xs={12} sm={6} lg={4} key={business.id}>
      <Card 
        elevation={2}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 2 },
            mb: 2 
          }}>
            <BusinessIcon color="primary" />
            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {business.tradeName}
            </Typography>
          </Box>

          <Chip
            icon={<VerifiedIcon />}
            label={business.gstin}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ 
              mb: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {business.mobile}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {business.email}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {JSON.parse(business.registeredAddress).city}, 
              {JSON.parse(business.registeredAddress).state}
            </Typography>
          </Box>

          <Box sx={{ 
            mt: 'auto', 
            display: 'flex', 
            justifyContent: 'flex-end' 
          }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<ReceiptIcon />}
              onClick={() => navigate('/invoice', { state: { businessId: business.id } })}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Create Invoice
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      {/* Responsive AppBar */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'grey.200' }}>
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: theme.palette.primary.main, 
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}
            onClick={() => navigate('/')}
          >
            BILLER
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Responsive Header */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          pt: { xs: 8, sm: 12 },
          pb: { xs: 4, sm: 6 },
          color: 'white',
          textAlign: 'center',
          mb: 4
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Registered Businesses
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
            }}
          >
            View and manage all registered businesses
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ flex: 1, mb: 8 }}>
        {/* Responsive Search and Create Button */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'stretch',
          mb: 4 
        }}>
          <TextField
            variant="outlined"
            placeholder="Search by business name or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: '100%',
              maxWidth: { sm: '60%' },
              '& .MuiOutlinedInput-root': {
                height: { xs: '48px', sm: '56px' }
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/invoice')}
            sx={{
              height: { xs: '48px', sm: '56px' },
              px: { xs: 2, sm: 3 },
              borderRadius: 2,
              textTransform: 'none',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 600,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              },
            }}
          >
            Create New Invoice
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Responsive Grid */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {loading ? (
            // Responsive loading skeletons
            [...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Skeleton 
                  variant="rectangular" 
                  height={{ xs: 180, sm: 200 }} 
                  sx={{ borderRadius: 2 }} 
                />
              </Grid>
            ))
          ) : filteredBusinesses.length > 0 ? (
            filteredBusinesses.map(renderBusinessCard)
          ) : (
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                align="center"
                sx={{ 
                  mt: 4,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                No businesses found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}

export default BusinessList; 