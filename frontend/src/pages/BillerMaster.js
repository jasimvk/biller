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
  Snackbar,
} from '@mui/material';
import { ArrowBack, Edit, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function BillerMaster() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    tradeName: '',
    legalName: '',
    gstin: '',
    pan: '',
    mobile: '',
    email: '',
    registeredAddress: {
      buildingNo: '',
      street: '',
      city: '',
      state: '',
      pinCode: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    showLogoOnInvoice: false,
    showBranchAddress: false
  });

  useEffect(() => {
    fetchBusinessDetails();
    fetchPreferences();
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
      setBusinessDetails({
        ...data,
        registeredAddress: {
          buildingNo: data.registeredAddress?.buildingNo || '',
          street: data.registeredAddress?.street || '',
          city: data.registeredAddress?.city || '',
          state: data.registeredAddress?.state || '',
          pinCode: data.registeredAddress?.pinCode || ''
        }
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching business details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/business/preferences', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      setPreferences(data);
    } catch (err) {
      console.error('Error fetching preferences:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setBusinessDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setBusinessDetails(prev => ({
      ...prev,
      registeredAddress: {
        ...prev.registeredAddress,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/business/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...businessDetails,
          registeredAddress: {
            ...businessDetails.registeredAddress
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update business details');
      }

      setShowSuccess(true);
      setIsEditing(false);
      fetchBusinessDetails(); // Refresh data
    } catch (err) {
      setError(err.message);
      console.error('Error updating business details:', err);
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch('http://localhost:5001/api/business/upload-logo', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      fetchBusinessDetails(); // Refresh to get updated logo URL
      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
      console.error('Error uploading logo:', err);
    }
  };

  const handlePreferenceChange = async (field) => {
    const newPreferences = {
      ...preferences,
      [field]: !preferences[field]
    };
    
    setPreferences(newPreferences);

    try {
      const response = await fetch('http://localhost:5001/api/business/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPreferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
      console.error('Error updating preferences:', err);
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
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
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
                      onChange={(e) => handleInputChange('tradeName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Legal Name"
                      value={businessDetails?.legalName || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                      onChange={(e) => handleInputChange('legalName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GSTIN"
                      value={businessDetails?.gstin || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                      onChange={(e) => handleInputChange('gstin', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="PAN"
                      value={businessDetails?.pan || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                      onChange={(e) => handleInputChange('pan', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mobile"
                      value={businessDetails?.mobile || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={businessDetails?.email || ''}
                      disabled={!isEditing}
                      sx={{ mb: 2 }}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                    onChange={(e) => handleAddressChange('buildingNo', e.target.value)}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street"
                    value={businessDetails?.registeredAddress?.street || ''}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={businessDetails?.registeredAddress?.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={businessDetails?.registeredAddress?.state || ''}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PIN Code"
                    value={businessDetails?.registeredAddress?.pinCode || ''}
                    onChange={(e) => handleAddressChange('pinCode', e.target.value)}
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
                  control={
                    <Checkbox 
                      checked={preferences.showLogoOnInvoice}
                      onChange={() => handlePreferenceChange('showLogoOnInvoice')}
                    />
                  }
                  label="Show Logo on Invoice"
                  disabled={!isEditing}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={preferences.showBranchAddress}
                      onChange={() => handlePreferenceChange('showBranchAddress')}
                    />
                  }
                  label="Show Branch Address"
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
                      onChange={handleLogoUpload}
                    />
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Add success snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Business details updated successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default BillerMaster; 
