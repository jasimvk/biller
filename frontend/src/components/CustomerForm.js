import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Divider,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material';

function CustomerForm({ initialValues = {}, onSubmit, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    gstin: '',
    email: '',
    phone: '',
    billing_address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    shipping_address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    use_same_address: true,
    ...initialValues
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [`${type}_address`]: {
        ...prev[`${type}_address`],
        [field]: value
      }
    }));

    // Update shipping address if using same address
    if (type === 'billing' && formData.use_same_address) {
      setFormData(prev => ({
        ...prev,
        shipping_address: {
          ...prev.billing_address,
          [field]: value
        }
      }));
    }
  };

  const handleSameAddressToggle = (event) => {
    const useSameAddress = event.target.checked;
    setFormData(prev => ({
      ...prev,
      use_same_address: useSameAddress,
      shipping_address: useSameAddress ? { ...prev.billing_address } : prev.shipping_address
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error.message || 'Failed to save customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAddressFields = (type) => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {type === 'billing' ? 'Billing Address' : 'Shipping Address'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            value={formData[`${type}_address`].street}
            onChange={(e) => handleAddressChange(type, 'street', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formData[`${type}_address`].city}
            onChange={(e) => handleAddressChange(type, 'city', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State"
            value={formData[`${type}_address`].state}
            onChange={(e) => handleAddressChange(type, 'state', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="PIN Code"
            value={formData[`${type}_address`].pincode}
            onChange={(e) => handleAddressChange(type, 'pincode', e.target.value)}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEdit ? 'Edit Customer' : 'Add New Customer'}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GSTIN"
              value={formData.gstin}
              onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
              error={!!errors.gstin}
              helperText={errors.gstin || 'Format: 2 digits state code + PAN + 1Z1'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
        </Grid>

        {renderAddressFields('billing')}

        <FormControlLabel
          control={
            <Switch
              checked={formData.use_same_address}
              onChange={handleSameAddressToggle}
              color="primary"
            />
          }
          label="Use same address for shipping"
        />

        {!formData.use_same_address && renderAddressFields('shipping')}

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ flex: 1 }}
          >
            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Customer' : 'Add Customer')}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default CustomerForm; 