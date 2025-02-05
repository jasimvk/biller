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
  Chip,
  MenuItem,
} from '@mui/material';
import { ArrowBack, Edit, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const businessTypes = [
  { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship' },
  { value: 'PARTNERSHIP_FIRM', label: 'Partnership Firm' },
  { value: 'PRIVATE_LIMITED', label: 'Private Limited Company' },
  { value: 'LLP', label: 'Limited Liability Partnership Firm' },
  { value: 'COOPERATIVE_SOCIETY', label: 'Co-Operative Society' },
  { value: 'AOP_BOI', label: 'AOP/BOI' }
];

const registrationTypes = [
  { value: 'REGULAR', label: 'Regular Supplier' },
  { value: 'COMPOSITION', label: 'Composition Supplier' }
];

const statesList = [
  { code: '01', name: 'JAMMU AND KASHMIR', shortCode: 'JK' },
  { code: '02', name: 'HIMACHAL PRADESH', shortCode: 'HP' },
  { code: '03', name: 'PUNJAB', shortCode: 'PB' },
  { code: '04', name: 'CHANDIGARH', shortCode: 'CH' },
  { code: '05', name: 'UTTARAKHAND', shortCode: 'UA' },
  { code: '06', name: 'HARYANA', shortCode: 'HR' },
  { code: '07', name: 'DELHI', shortCode: 'DL' },
  { code: '08', name: 'RAJASTHAN', shortCode: 'RJ' },
  { code: '09', name: 'UTTAR PRADESH', shortCode: 'UP' },
  { code: '10', name: 'BIHAR', shortCode: 'BH' },
  { code: '11', name: 'SIKKIM', shortCode: 'SK' },
  { code: '12', name: 'ARUNACHAL PRADESH', shortCode: 'AR' },
  { code: '13', name: 'NAGALAND', shortCode: 'NL' },
  { code: '14', name: 'MANIPUR', shortCode: 'MN' },
  { code: '15', name: 'MIZORAM', shortCode: 'MI' },
  { code: '16', name: 'TRIPURA', shortCode: 'TR' },
  { code: '17', name: 'MEGHALAYA', shortCode: 'ME' },
  { code: '18', name: 'ASSAM', shortCode: 'AS' },
  { code: '19', name: 'WEST BENGAL', shortCode: 'WB' },
  { code: '20', name: 'JHARKHAND', shortCode: 'JH' },
  { code: '21', name: 'ODISHA', shortCode: 'OR' },
  { code: '22', name: 'CHHATTISGARH', shortCode: 'CT' },
  { code: '23', name: 'MADHYA PRADESH', shortCode: 'MP' },
  { code: '24', name: 'GUJARAT', shortCode: 'GJ' },
  { code: '26', name: 'DADRA AND NAGAR HAVELI AND DAMAN AND DIU', shortCode: 'DNHDD' },
  { code: '27', name: 'MAHARASHTRA', shortCode: 'MH' },
  { code: '29', name: 'KARNATAKA', shortCode: 'KA' },
  { code: '30', name: 'GOA', shortCode: 'GA' },
  { code: '31', name: 'LAKSHADWEEP', shortCode: 'LD' },
  { code: '32', name: 'KERALA', shortCode: 'KL' },
  { code: '33', name: 'TAMIL NADU', shortCode: 'TN' },
  { code: '34', name: 'PUDUCHERRY', shortCode: 'PY' },
  { code: '35', name: 'ANDAMAN AND NICOBAR ISLANDS', shortCode: 'AN' },
  { code: '36', name: 'TELANGANA', shortCode: 'TL' },
  { code: '37', name: 'ANDHRA PRADESH', shortCode: 'AP' },
  { code: '38', name: 'LADAKH', shortCode: 'LA' },
  { code: '97', name: 'OTHER TERRITORY', shortCode: 'OT' },
];

function BillerMaster() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Updated business details state to match registration form
  const [businessDetails, setBusinessDetails] = useState({
    tradeName: '',
    legalName: '',
    gstin: '',
    pan: '',
    mobile: '',
    email: '',
    website: '',
    businessType: '',
    registrationType: '',
    registeredAddress: {
      buildingNo: '',
      premisesName: '',
      street: '',
      locality: '',
      city: '',
      district: '',
      state: '',
      pinCode: ''
    }
  });

  const [preferences, setPreferences] = useState({
    showLogoOnInvoice: false,
    showBranchAddress: false,
     
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  // Fetch business details
  useEffect(() => {
    fetchBusinessDetails();
    fetchPreferences();
  }, []);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/business/details', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch business details');
      }

      const data = await response.json();
      setBusinessDetails(prevState => ({
        ...prevState,
        ...data,
        registeredAddress: {
          ...prevState.registeredAddress,
          ...data.registeredAddress
        }
      }));
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

  // Validation functions
  const validateGSTIN = (gstin, state) => {
    const basicGstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!basicGstinRegex.test(gstin)) return false;
    
    if (!state) return true;
    
    const selectedState = statesList.find(s => s.name === state);
    if (!selectedState) return false;
    
    const stateCode = selectedState.code.padStart(2, '0');
    return gstin.startsWith(stateCode);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!businessDetails.tradeName) newErrors.tradeName = 'Trade name is required';
    if (!businessDetails.legalName) newErrors.legalName = 'Legal name is required';
    if (!businessDetails.gstin) newErrors.gstin = 'GSTIN is required';
    if (!businessDetails.pan) newErrors.pan = 'PAN is required';
    if (!businessDetails.mobile) newErrors.mobile = 'Mobile number is required';
    if (!businessDetails.email) newErrors.email = 'Email is required';
    if (!businessDetails.businessType) newErrors.businessType = 'Business type is required';
    if (!businessDetails.registrationType) newErrors.registrationType = 'Registration type is required';

    // Validate GSTIN format
    if (businessDetails.gstin && !validateGSTIN(businessDetails.gstin, businessDetails.registeredAddress.state)) {
      newErrors.gstin = 'Invalid GSTIN format or state code mismatch';
    }

    // Validate PAN format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (businessDetails.pan && !panRegex.test(businessDetails.pan)) {
      newErrors.pan = 'Invalid PAN format';
    }

    // Validate mobile format
    const mobileRegex = /^[6-9]\d{9}$/;
    if (businessDetails.mobile && !mobileRegex.test(businessDetails.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (businessDetails.email && !emailRegex.test(businessDetails.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
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

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Save changes
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/business/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...businessDetails,
          preferences
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update business details');
      }

      setShowSuccess(true);
      setIsEditing(false);
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

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {!isEditing ? (
          // Display View
          <>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    bgcolor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                     Biller Master
                  </Typography>
                  
                </Box>
              </Box>
              <Button
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                variant="contained"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                Edit Profile
              </Button>
            </Box>

            {/* Main Content */}
            <Grid container spacing={3}>
              {/* Business Details Card */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'white',
                    boxShadow: '0 0 2px 0 rgba(0,0,0,0.05), 0 2px 10px 0 rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Business Details
                  </Typography>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Trade Name', value: businessDetails.tradeName },
                      { label: 'Legal Name', value: businessDetails.legalName },
                      { label: 'GSTIN', value: businessDetails.gstin },
                      { label: 'PAN', value: businessDetails.pan }
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#f8fafc',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }
                        }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                            {item.value || 'Not specified'}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'white',
                    height: '100%',
                    boxShadow: '0 0 2px 0 rgba(0,0,0,0.05), 0 2px 10px 0 rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { icon: '📱', label: 'Mobile', value: businessDetails.mobile },
                      { icon: '📧', label: 'Email', value: businessDetails.email }
                    ].map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <Typography variant="h6">{item.icon}</Typography>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {item.value || 'Not specified'}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Address */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'white',
                    height: '100%',
                    boxShadow: '0 0 2px 0 rgba(0,0,0,0.05), 0 2px 10px 0 rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Business Address
                  </Typography>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#f8fafc',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {`${businessDetails.registeredAddress.buildingNo || ''} 
                       ${businessDetails.registeredAddress.street || ''}
                       ${businessDetails.registeredAddress.city || ''} 
                       ${businessDetails.registeredAddress.state || ''} 
                       ${businessDetails.registeredAddress.pinCode || ''}`
                       .trim().replace(/\s+/g, ' ') || 'Address not specified'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Preferences */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'white',
                    boxShadow: '0 0 2px 0 rgba(0,0,0,0.05), 0 2px 10px 0 rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Preferences
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(preferences).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Box sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }
                        }}>
                          <Typography variant="body1">
                            {key.split(/(?=[A-Z])/).join(' ')}
                          </Typography>
                          <Chip
                            label={value ? 'Enabled' : 'Disabled'}
                            color={value ? 'primary' : 'default'}
                            size="small"
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </>
        ) : (
          // Edit Form View
          <>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => setIsEditing(false)}
                  sx={{
                    bgcolor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Edit Biller Master
                </Typography>
              </Box>
              <Button
                startIcon={<Save />}
                onClick={handleSave}
                variant="contained"
                sx={{
                  minWidth: 200,
                  py: 1.8,
                  px: 4,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: 3,
                }}
              >
                Save Changes
              </Button>
            </Box>

            {/* Form Content */}
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Grid container spacing={4}>
                {/* Business Type Section */}
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Business Type
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Business Type"
                        value={businessDetails.businessType || ''}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'grey.50'
                          }
                        }}
                      >
                        {businessTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Registration Type"
                        value={businessDetails.registrationType || ''}
                        onChange={(e) => handleInputChange('registrationType', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'grey.50'
                          }
                        }}
                      >
                        {registrationTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Business Details Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Business Details
                  </Typography>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Trade Name', field: 'tradeName' },
                      { label: 'Legal Name', field: 'legalName' },
                      { label: 'GSTIN', field: 'gstin' },
                      { label: 'PAN', field: 'pan' },
                      { label: 'Mobile', field: 'mobile' },
                      { label: 'Email', field: 'email' },
                      { label: 'Website', field: 'website' }
                    ].map((item) => (
                      <Grid item xs={12} sm={6} key={item.field}>
                        <TextField
                          fullWidth
                          label={item.label}
                          value={businessDetails[item.field] || ''}
                          onChange={(e) => handleInputChange(item.field, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: 'grey.50'
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                {/* Address Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Business Address
                  </Typography>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Building No./Flat No.', field: 'buildingNo' },
                      { label: 'Street', field: 'street' },
                      { label: 'City', field: 'city' },
                      { label: 'State', field: 'state' },
                      { label: 'PIN Code', field: 'pinCode' }
                    ].map((item) => (
                      <Grid item xs={12} sm={6} key={item.field}>
                        <TextField
                          fullWidth
                          label={item.label}
                          value={businessDetails.registeredAddress[item.field] || ''}
                          onChange={(e) => handleAddressChange(item.field, e.target.value)}
                          select={item.field === 'state'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: 'grey.50'
                            }
                          }}
                        >
                          {item.field === 'state' && statesList.map((state) => (
                            <MenuItem key={state.code} value={state.name}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                {/* Preferences Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Preferences
                  </Typography>
                  <FormGroup>
                    {Object.entries(preferences).map(([key, value]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            checked={value}
                            onChange={() => handlePreferenceChange(key)}
                          />
                        }
                        label={key.split(/(?=[A-Z])/).join(' ')}
                      />
                    ))}
                  </FormGroup>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success">
            Changes saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default BillerMaster; 
