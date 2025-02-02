import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
  Container,
  AppBar,
  Toolbar,
  useTheme,
  Stack,
  Alert,
  MenuItem,
  IconButton,
  Tooltip,
  Collapse,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  ContentCopy as ContentCopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

// Updated state list with GST codes
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

const emptyAddress = {
  building: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
};

function Registration() {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State for form sections visibility
  const [expandedSections, setExpandedSections] = useState({
    branch: false,
    godown: false
  });

  // Form data state
  const [formData, setFormData] = useState({
    tradeName: '',
    legalName: '',
    gstin: '',
    pan: '',
    udyamNumber: '',
    mobile: '',
    email: '',
    website: '',
    registeredAddress: { ...emptyAddress },
    branchAddress: { ...emptyAddress },
    godownAddress: { ...emptyAddress }
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.tradeName) newErrors.tradeName = 'Trade Name is required';
    if (!formData.legalName) newErrors.legalName = 'Legal Name is required';
    
    // GSTIN validation with state code check
    if (!formData.gstin) {
      newErrors.gstin = 'GSTIN is required';
    } else if (!validateGSTIN(formData.gstin, formData.registeredAddress.state)) {
      newErrors.gstin = `Invalid GSTIN format. Should start with state code ${
        statesList.find(s => s.name === formData.registeredAddress.state)?.code || ''
      }`;
    }

    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!formData.pan) {
      newErrors.pan = 'PAN is required';
    } else if (!panRegex.test(formData.pan)) {
      newErrors.pan = 'Invalid PAN format';
    }

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Registered Address validation
    if (!formData.registeredAddress.building) newErrors['registeredAddress.building'] = 'Building is required';
    if (!formData.registeredAddress.street) newErrors['registeredAddress.street'] = 'Street is required';
    if (!formData.registeredAddress.city) newErrors['registeredAddress.city'] = 'City is required';
    if (!formData.registeredAddress.state) newErrors['registeredAddress.state'] = 'State is required';
    if (!formData.registeredAddress.pinCode) newErrors['registeredAddress.pinCode'] = 'PIN Code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    }
  };

  // Copy address function
  const copyAddress = (from, to) => {
    setFormData(prev => ({
      ...prev,
      [to]: { ...prev[from] }
    }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    if (!validateForm()) {
      console.log('Validation errors:', errors);
      setErrors(prev => ({ ...prev, submit: 'Please fix the validation errors' }));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/business/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/businesses', { 
            state: { message: 'Business registered successfully!' }
          });
        }, 2000);
      } else {
        console.error('Registration failed:', data.error);
        setErrors({ submit: data.error || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Failed to register business. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Address form fields component
  const AddressFields = ({ prefix, required = false }) => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Building/Premises"
          name={`${prefix}.building`}
          value={formData[prefix].building}
          onChange={handleChange}
          required={required}
          sx={textFieldStyle}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Street"
          name={`${prefix}.street`}
          value={formData[prefix].street}
          onChange={handleChange}
          required={required}
          sx={textFieldStyle}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="City"
          name={`${prefix}.city`}
          value={formData[prefix].city}
          onChange={handleChange}
          required={required}
          sx={textFieldStyle}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          select
          label="State"
          name={`${prefix}.state`}
          value={formData[prefix].state}
          onChange={handleChange}
          required={required}
          error={!!errors[`${prefix}.state`]}
          helperText={errors[`${prefix}.state`] || 'Select state to determine GST code'}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'grey.50',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }
          }}
        >
          {statesList.map((state) => (
            <MenuItem key={state.code} value={state.name}>
              {state.name} ({state.code})
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="PIN Code"
          name={`${prefix}.pinCode`}
          value={formData[prefix].pinCode}
          onChange={handleChange}
          required={required}
          sx={textFieldStyle}
        />
      </Grid>
    </Grid>
  );

  // Common text field style
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    }
  };

  // Add GSTIN validation based on state code
  const validateGSTIN = (gstin, state) => {
    if (!gstin || !state) return false;
    
    const selectedState = statesList.find(s => s.name === state);
    if (!selectedState) return false;

    const stateCode = selectedState.code;
    const gstinRegex = new RegExp(`^${stateCode}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`);
    
    return gstinRegex.test(gstin);
  };

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
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ position: 'relative' }}>
            <BusinessIcon sx={{ fontSize: 56, mb: 3, opacity: 0.9 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Register Your Business
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
              Join our platform to streamline your GST billing and business management
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Form Section */}
      <Container 
        maxWidth="md" 
        sx={{ 
          mb: 8, 
          mt: -6,
          position: 'relative',
          zIndex: 1
        }}
      >
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
          {errors.submit && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              {errors.submit}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Business Details Section */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1
                }}>
                  <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}>
                    Business Details
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  mb: 3
                }}>
                  Enter your business information as registered with GST
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Trade Name"
                  name="tradeName"
                  value={formData.tradeName}
                  onChange={handleChange}
                  error={!!errors.tradeName}
                  helperText={errors.tradeName}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                      '& fieldset': {
                        borderColor: 'grey.200',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Legal Name"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleChange}
                  error={!!errors.legalName}
                  helperText={errors.legalName}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                      '& fieldset': {
                        borderColor: 'grey.200',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GSTIN"
                  name="gstin"
                  value={formData.gstin.toUpperCase()}
                  onChange={handleChange}
                  error={!!errors.gstin}
                  helperText={errors.gstin || 'Format: 22AAAAA0000A1Z1'}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                      '& fieldset': {
                        borderColor: 'grey.200',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN"
                  name="pan"
                  value={formData.pan.toUpperCase()}
                  onChange={handleChange}
                  error={!!errors.pan}
                  helperText={errors.pan}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                      '& fieldset': {
                        borderColor: 'grey.200',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Udyam Number"
                  name="udyamNumber"
                  value={formData.udyamNumber}
                  onChange={handleChange}
                  error={!!errors.udyamNumber}
                  helperText={errors.udyamNumber}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                      '& fieldset': {
                        borderColor: 'grey.200',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                      '& fieldset': {
                        borderColor: 'grey.200',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                      '& fieldset': {
                        borderColor: 'grey.200',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  error={!!errors.website}
                  helperText={errors.website}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                      '& fieldset': {
                        borderColor: 'grey.200',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    }
                  }}
                />
              </Grid>

              {/* Registered Address Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Registered Address
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <AddressFields prefix="registeredAddress" required={true} />
              </Grid>

              {/* Branch Address Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 4 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, flex: 1 }}>
                    Branch Address
                  </Typography>
                  <Button
                    onClick={() => toggleSection('branch')}
                    endIcon={expandedSections.branch ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {expandedSections.branch ? 'Hide' : 'Show'}
                  </Button>
                </Box>
                <Collapse in={expandedSections.branch}>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyAddress('registeredAddress', 'branchAddress')}
                    >
                      Copy from Registered Address
                    </Button>
                  </Box>
                  <AddressFields prefix="branchAddress" />
                </Collapse>
              </Grid>

              {/* Godown Address Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 4 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, flex: 1 }}>
                    Godown Address
                  </Typography>
                  <Button
                    onClick={() => toggleSection('godown')}
                    endIcon={expandedSections.godown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {expandedSections.godown ? 'Hide' : 'Show'}
                  </Button>
                </Box>
                <Collapse in={expandedSections.godown}>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyAddress('registeredAddress', 'godownAddress')}
                    >
                      Copy from Registered Address
                    </Button>
                  </Box>
                  <AddressFields prefix="godownAddress" />
                </Collapse>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ 
                  mt: 6, 
                  display: 'flex', 
                  justifyContent: 'center' 
                }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      minWidth: 250,
                      py: 1.8,
                      px: 6,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      borderRadius: 3,
                      boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      '&:hover': {
                        boxShadow: '0 12px 20px rgba(37, 99, 235, 0.3)',
                      },
                    }}
                  >
                    {isSubmitting ? 'Registering...' : 'Register Business'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <Footer />

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            width: '100%',
            boxShadow: 2,
            borderRadius: 2
          }}
        >
          Business registered successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Registration;