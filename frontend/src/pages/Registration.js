import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';

const statesList = [
  { code: '32', name: 'Kerala' },
  { code: '27', name: 'Maharashtra' },
  // Add all states with their GST codes
];

function Registration() {
  const [formData, setFormData] = useState({
    tradeName: '',
    legalName: '',
    gstin: '',
    pan: '',
    udyamNumber: '',
    registeredAddress: {
      building: '',
      premises: '',
      street: '',
      locality: '',
      city: '',
      district: '',
      state: '',
      pinCode: '',
    },
    branchAddress: {
      building: '',
      premises: '',
      street: '',
      locality: '',
      city: '',
      district: '',
      state: '',
      pinCode: '',
    },
    godownAddress: {
      building: '',
      premises: '',
      street: '',
      locality: '',
      city: '',
      district: '',
      state: '',
      pinCode: '',
    },
    mobile: '',
    email: '',
    website: '',
    hasBranch: false,
    hasGodown: false,
  });

  const validateGSTIN = (gstin) => {
    // GSTIN format: 2 digits state code + PAN + 1 digit entity number + Z + 1 check digit
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateGSTIN(formData.gstin)) {
      alert('Invalid GSTIN format');
      return;
    }

    if (!validatePAN(formData.pan)) {
      alert('Invalid PAN format');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/business/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful registration
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const renderAddressFields = (section, title, required = true) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Building/Flat No."
            value={formData[section].building}
            onChange={(e) => handleChange(section, 'building', e.target.value)}
            required={required}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Premises Name"
            value={formData[section].premises}
            onChange={(e) => handleChange(section, 'premises', e.target.value)}
            required={required}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Road/Street"
            value={formData[section].street}
            onChange={(e) => handleChange(section, 'street', e.target.value)}
            required={required}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Locality/Sub-Locality"
            value={formData[section].locality}
            onChange={(e) => handleChange(section, 'locality', e.target.value)}
            required={required}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City/Town/Village"
            value={formData[section].city}
            onChange={(e) => handleChange(section, 'city', e.target.value)}
            required={required}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="District"
            value={formData[section].district}
            onChange={(e) => handleChange(section, 'district', e.target.value)}
            required={required}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="State"
            value={formData[section].state}
            onChange={(e) => handleChange(section, 'state', e.target.value)}
            required={required}
          >
            {statesList.map((state) => (
              <MenuItem key={state.code} value={state.code}>
                {state.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="PIN Code"
            value={formData[section].pinCode}
            onChange={(e) => handleChange(section, 'pinCode', e.target.value)}
            required={required}
            inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, color: 'primary.main', textAlign: 'center' }}>
        Business Registration
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Trade Name"
              value={formData.tradeName}
              onChange={(e) => handleChange(null, 'tradeName', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Legal Name (as per GST Certificate)"
              value={formData.legalName}
              onChange={(e) => handleChange(null, 'legalName', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GSTIN"
              value={formData.gstin}
              onChange={(e) => handleChange(null, 'gstin', e.target.value.toUpperCase())}
              required
              inputProps={{ maxLength: 15 }}
              helperText="Format: 2 digits state code + PAN + 1Z1"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="PAN Number"
              value={formData.pan}
              onChange={(e) => handleChange(null, 'pan', e.target.value.toUpperCase())}
              required
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="UDYAM Registration Number"
              value={formData.udyamNumber}
              onChange={(e) => handleChange(null, 'udyamNumber', e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        {renderAddressFields('registeredAddress', 'Registered Office Address')}
        
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.hasBranch}
              onChange={(e) => handleChange(null, 'hasBranch', e.target.checked)}
            />
          }
          label="Add Branch Address"
        />
        
        {formData.hasBranch && renderAddressFields('branchAddress', 'Branch Address', false)}
        
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.hasGodown}
              onChange={(e) => handleChange(null, 'hasGodown', e.target.checked)}
            />
          }
          label="Add Godown Address"
        />
        
        {formData.hasGodown && renderAddressFields('godownAddress', 'Godown Address', false)}

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={formData.mobile}
              onChange={(e) => handleChange(null, 'mobile', e.target.value)}
              required
              inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange(null, 'email', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Website"
              value={formData.website}
              onChange={(e) => handleChange(null, 'website', e.target.value)}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ minWidth: 200 }}
          >
            Register Business
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default Registration;