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
  Stack,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ArrowBack, Edit, Save, Upload, Business, Badge, Article, Numbers, CalendarMonth, CalendarToday, LocationOn, Warehouse, Settings, Image } from '@mui/icons-material';
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

// Add this component definition before the AddOnFeaturesSection
const AddressFields = ({ type, values, onChange }) => (
  <Stack spacing={2}>
    <TextField
      fullWidth
      size="small"
      label="Building No./Flat No."
      value={values?.buildingNo || ''}
      onChange={(e) => onChange(type, 'buildingNo', e.target.value)}
    />
    <TextField
      fullWidth
      size="small"
      label="Street"
      value={values?.street || ''}
      onChange={(e) => onChange(type, 'street', e.target.value)}
    />
    <TextField
      fullWidth
      size="small"
      label="City"
      value={values?.city || ''}
      onChange={(e) => onChange(type, 'city', e.target.value)}
    />
    <TextField
      fullWidth
      size="small"
      label="State"
      select
      value={values?.state || ''}
      onChange={(e) => onChange(type, 'state', e.target.value)}
    >
      {statesList.map((state) => (
        <MenuItem key={state.code} value={state.name}>
          {state.name}
        </MenuItem>
      ))}
    </TextField>
    <TextField
      fullWidth
      size="small"
      label="PIN Code"
      value={values?.pinCode || ''}
      onChange={(e) => onChange(type, 'pinCode', e.target.value)}
    />
  </Stack>
);

// Update the AddOnFeaturesSection component
const AddOnFeaturesSection = ({ 
  addOnFeatures, 
  handleAddOnFeatureChange, 
  handleLogoUpload 
}) => (
  <Box sx={{ 
    position: 'fixed',
    top: 100,
    right: 32,
    zIndex: 1200,
    '@media (max-width: 1400px)': {
      position: 'static',
      mb: 3,
      width: '100%'
    }
  }}>
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        width: { xs: '100%', md: 280 },
        bgcolor: '#fff',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: '#FAFBFC'
      }}>
        <Settings 
          sx={{ 
            fontSize: 18,
            color: 'primary.main'
          }} 
        />
        <Typography 
          variant="button" 
          sx={{ 
            color: 'text.secondary',
            letterSpacing: '0.5px',
            fontSize: '0.75rem'
          }}
        >
          ADD ON FEATURES
        </Typography>
      </Box>
      
      {/* Features List */}
      <Box sx={{ p: 1 }}>
        {[
          { icon: <Image />, label: 'Company Logo', key: 'addLogo' },
          { icon: <Business />, label: 'Branch Office', key: 'addBranch' },
          { icon: <Warehouse />, label: 'Godown', key: 'addGodown' }
        ].map((feature, index) => (
          <Box
            key={feature.key}
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: index !== 2 ? '1px solid' : 'none',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.01)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box 
                sx={{ 
                  color: 'primary.main',
                  display: 'flex',
                  '& svg': { fontSize: 20 }
                }}
              >
                {feature.icon}
              </Box>
              <Typography 
                variant="body2"
                sx={{ color: 'text.primary' }}
              >
                {feature.label}
              </Typography>
            </Box>
            <Switch
              size="small"
              checked={addOnFeatures[feature.key]}
              onChange={() => handleAddOnFeatureChange(feature.key)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'primary.main'
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'primary.main'
                }
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Logo Upload Section */}
      {addOnFeatures.addLogo && (
        <Box sx={{ 
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: '#FAFBFC'
        }}>
          <input
            accept="image/jpeg"
            style={{ display: 'none' }}
            id="logo-upload"
            type="file"
            onChange={handleLogoUpload}
          />
          <label htmlFor="logo-upload">
            <Button
              component="span"
              variant="outlined"
              size="small"
              startIcon={<Upload />}
              fullWidth
              sx={{
                textTransform: 'none',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              Upload Company Logo
            </Button>
          </label>
        </Box>
      )}
    </Paper>
  </Box>
);

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

  // Add new state for add-on features
  const [addOnFeatures, setAddOnFeatures] = useState({
    addLogo: false,
 
  });

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

  const handleAddressChange = (type, field, value) => {
    setBusinessDetails(prev => ({
      ...prev,
      [type === 'registered' ? 'registeredAddress' : 
       type === 'branch' ? 'branchAddress' : 'godownAddress']: {
        ...prev[type === 'registered' ? 'registeredAddress' : 
              type === 'branch' ? 'branchAddress' : 'godownAddress'],
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
          branchAddress: addOnFeatures.addBranch ? businessDetails.branchAddress : null,
          godownAddress: addOnFeatures.addGodown ? businessDetails.godownAddress : null,
        }),
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

  // Add new handler for add-on features
  const handleAddOnFeatureChange = async (feature) => {
    const newValue = !addOnFeatures[feature];
    setAddOnFeatures(prev => ({
      ...prev,
      [feature]: newValue
    }));

    // If turning off a feature, show confirmation dialog
    if (!newValue) {
      // Add confirmation dialog logic here if needed
    }
  };

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
      {/* Header with gradient */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          color: 'white',
          py: 2,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => navigate('/dashboard')}
                sx={{ color: 'white' }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                Biller Master
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isEditing && (
                <Button
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  variant="outlined"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', xl: 'row' },
          gap: 3
        }}
      >
        {/* Add On Features */}
        <Box sx={{ 
          display: { xs: 'block', xl: 'none' },
          width: '100%'
        }}>
          <AddOnFeaturesSection 
            addOnFeatures={addOnFeatures}
            handleAddOnFeatureChange={handleAddOnFeatureChange}
            handleLogoUpload={handleLogoUpload}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {!isEditing ? (
            // View Mode Layout
            <Grid container spacing={4}>
              {/* Left Column - Profile Card */}
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden'
                  }}
                >
                  {/* Profile Header */}
                  <Box 
                    sx={{ 
                      p: 3,
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      color: 'white',
                      position: 'relative'
                    }}
                  >
                    {/* Logo Circle */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        border: '4px solid',
                        borderColor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        overflow: 'hidden'
                      }}
                    >
                      {businessDetails.logo ? (
                        <img
                          src={businessDetails.logo}
                          alt="Company Logo"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Business sx={{ fontSize: 40, color: 'primary.main' }} />
                      )}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {businessDetails.tradeName || 'Company Name'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {businessDetails.legalName || 'Legal Entity Name'}
                    </Typography>
                  </Box>

                  {/* Key Business Information */}
                  <List sx={{ py: 0 }}>
                    {[
                      { icon: <Badge />, label: 'GSTIN', value: businessDetails.gstin },
                      { icon: <Article />, label: 'PAN', value: businessDetails.pan },
                      { icon: <Numbers />, label: 'UDYAM', value: businessDetails.udyamNumber },
                      { icon: <CalendarMonth />, label: 'Incorporated', value: businessDetails.incorporationDate },
                      { icon: <CalendarToday />, label: 'GST Registered', value: businessDetails.gstRegistrationDate }
                    ].map((item, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          py: 1.5,
                          borderBottom: index !== 4 ? '1px solid' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.label}
                          secondary={item.value || '-'}
                          primaryTypographyProps={{ 
                            variant: 'caption',
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                          }}
                          secondaryTypographyProps={{ 
                            variant: 'body2',
                            color: 'text.primary',
                            fontWeight: 500
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              {/* Right Column - Additional Details */}
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  {/* Financial Information */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                      Financial Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Financial Year
                          </Typography>
                          <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            {businessDetails.financialYearFrom} - {businessDetails.financialYearTo}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Books Period
                          </Typography>
                          <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            {businessDetails.booksFrom} - {businessDetails.booksTo}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Address Information */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                      Address Information
                    </Typography>
                    <Grid container spacing={3}>
                      {/* Principal Place of Business */}
                      <Grid item xs={12}>
                        <Box sx={{ p: 2.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                            <Typography variant="subtitle2">
                              Principal Place of Business
                            </Typography>
                          </Box>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">
                              {businessDetails.registeredAddress.buildingNo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {businessDetails.registeredAddress.street}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {businessDetails.registeredAddress.city}, {businessDetails.registeredAddress.state}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {businessDetails.registeredAddress.pinCode}
                            </Typography>
                          </Stack>
                        </Box>
                      </Grid>

                      {/* Branch Address - Show only if enabled */}
                      {addOnFeatures.addBranch && businessDetails.branchAddress && (
                        <Grid item xs={12} md={6}>
                          <Box sx={{ p: 2.5, bgcolor: '#f8f9fa', borderRadius: 1, height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                              <Business sx={{ color: 'primary.main', mr: 1 }} />
                              <Typography variant="subtitle2">
                                Branch Office
                              </Typography>
                            </Box>
                            <Stack spacing={0.5}>
                              <Typography variant="body2">
                                {businessDetails.branchAddress.buildingNo}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {businessDetails.branchAddress.street}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {businessDetails.branchAddress.city}, {businessDetails.branchAddress.state}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {businessDetails.branchAddress.pinCode}
                              </Typography>
                            </Stack>
                          </Box>
                        </Grid>
                      )}

                      {/* Godown Address - Show only if enabled */}
                      {addOnFeatures.addGodown && businessDetails.godownAddress && (
                        <Grid item xs={12} md={6}>
                          <Box sx={{ p: 2.5, bgcolor: '#f8f9fa', borderRadius: 1, height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                              <Warehouse sx={{ color: 'primary.main', mr: 1 }} />
                              <Typography variant="subtitle2">
                                Godown
                              </Typography>
                            </Box>
                            <Stack spacing={0.5}>
                              <Typography variant="body2">
                                {businessDetails.godownAddress.buildingNo}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {businessDetails.godownAddress.street}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {businessDetails.godownAddress.city}, {businessDetails.godownAddress.state}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {businessDetails.godownAddress.pinCode}
                              </Typography>
                            </Stack>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            // Edit Mode - Original edit form layout
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" sx={{ mb: 3 }}>Edit Business Details</Typography>
              <Grid container spacing={3}>
                {/* Business Details */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Business Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Trade Name"
                        value={businessDetails.tradeName}
                        onChange={(e) => handleInputChange('tradeName', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Legal Name"
                        value={businessDetails.legalName}
                        onChange={(e) => handleInputChange('legalName', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="GSTIN"
                        value={businessDetails.gstin}
                        onChange={(e) => handleInputChange('gstin', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="PAN"
                        value={businessDetails.pan}
                        onChange={(e) => handleInputChange('pan', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="UDYAM Number"
                        value={businessDetails.udyamNumber}
                        onChange={(e) => handleInputChange('udyamNumber', e.target.value)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Dates Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Important Dates</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Date of Incorporation"
                        value={businessDetails.incorporationDate}
                        onChange={(e) => handleInputChange('incorporationDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="GST Registration Date"
                        value={businessDetails.gstRegistrationDate}
                        onChange={(e) => handleInputChange('gstRegistrationDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Financial Period */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Financial Period</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Financial Year From"
                        value={businessDetails.financialYearFrom}
                        onChange={(e) => handleInputChange('financialYearFrom', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Financial Year To"
                        value={businessDetails.financialYearTo}
                        onChange={(e) => handleInputChange('financialYearTo', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Books From"
                        value={businessDetails.booksFrom}
                        onChange={(e) => handleInputChange('booksFrom', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Books To"
                        value={businessDetails.booksTo}
                        onChange={(e) => handleInputChange('booksTo', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Principal Place of Business */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Principal Place of Business</Typography>
                  <AddressFields
                    type="registered"
                    values={businessDetails.registeredAddress}
                    onChange={handleAddressChange}
                  />
                </Grid>

                {/* Branch Address - Show if enabled in Add On Features */}
                {addOnFeatures.addBranch && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>Branch Office Address</Typography>
                      <AddressFields
                        type="branch"
                        values={businessDetails.branchAddress}
                        onChange={handleAddressChange}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Godown Address - Show if enabled in Add On Features */}
                {addOnFeatures.addGodown && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>Godown Address</Typography>
                      <AddressFields
                        type="godown"
                        values={businessDetails.godownAddress}
                        onChange={handleAddressChange}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>

        {/* Add On Features for larger screens */}
        <Box sx={{ 
          display: { xs: 'none', xl: 'block' },
          width: 280,
          flexShrink: 0
        }}>
          <AddOnFeaturesSection 
            addOnFeatures={addOnFeatures}
            handleAddOnFeatureChange={handleAddOnFeatureChange}
            handleLogoUpload={handleLogoUpload}
          />
        </Box>
      </Container>

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
    </Box>
  );
}

export default BillerMaster; 
