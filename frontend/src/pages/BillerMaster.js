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
  useTheme,
  IconButton,
  Skeleton,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ArrowBack, Edit, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function BillerMaster() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/business/details', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch business details');
      }

      const data = await response.json();
      setBusinessDetails(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching business details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" component="h1" fontWeight="600">
              Biller Master
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={isEditing ? <Save /> : <Edit />}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Save Changes' : 'Edit Details'}
          </Button>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Side - Business Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Business Details
              </Typography>
              {loading ? (
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" height={60} />
                  <Skeleton variant="text" height={60} />
                  <Skeleton variant="text" height={60} />
                </Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Trade Name"
                      value={businessDetails?.tradeName || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Legal Name"
                      value={businessDetails?.legalName || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GSTIN"
                      value={businessDetails?.gstin || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="PAN"
                      value={businessDetails?.pan || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mobile"
                      value={businessDetails?.mobile || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={businessDetails?.email || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
              )}
            </Paper>

            {/* Address Section */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Principal Place of Business
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Building/Premises"
                    value={businessDetails?.registeredAddress?.buildingNo || ''}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street"
                    value={businessDetails?.registeredAddress?.street || ''}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={businessDetails?.registeredAddress?.city || ''}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={businessDetails?.registeredAddress?.state || ''}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PIN Code"
                    value={businessDetails?.registeredAddress?.pinCode || ''}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Side - Additional Options */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Additional Options
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Show Logo on Invoice"
                  disabled={!isEditing}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Show Branch Address"
                  disabled={!isEditing}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Show GSTIN"
                  disabled={!isEditing}
                />
              </FormGroup>
              {isEditing && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Upload Logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                    />
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default BillerMaster; 