import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Typography,
  Divider,
  InputAdornment,
} from '@mui/material';
import { GSTCalculator, validateGSTProduct } from '../utils/gstCalculator';

function ProductForm({ initialValues = {}, onSubmit, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    hsn_code: '',
    description: '',
    price: '',
    gst_rate: '',
    ...initialValues
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const validation = validateGSTProduct(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate GST preview if price and rate are valid
  const gstPreview = React.useMemo(() => {
    if (formData.price && formData.gst_rate) {
      try {
        return GSTCalculator.calculateGST(Number(formData.price), Number(formData.gst_rate));
      } catch (error) {
        return null;
      }
    }
    return null;
  }, [formData.price, formData.gst_rate]);

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          <TextField
            label="HSN Code"
            name="hsn_code"
            value={formData.hsn_code}
            onChange={handleChange}
            error={!!errors.hsn_code}
            helperText={errors.hsn_code}
            fullWidth
            required
          />
        </Box>

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />

          <FormControl fullWidth error={!!errors.gst_rate} required>
            <InputLabel>GST Rate</InputLabel>
            <Select
              name="gst_rate"
              value={formData.gst_rate}
              onChange={handleChange}
              label="GST Rate"
            >
              {GSTCalculator.getValidRates().map(rate => (
                <MenuItem key={rate} value={rate}>{rate}%</MenuItem>
              ))}
            </Select>
            {errors.gst_rate && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                {errors.gst_rate}
              </Typography>
            )}
          </FormControl>
        </Box>

        {gstPreview && (
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" gutterBottom>
              GST Calculation Preview
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Base Price</Typography>
                <Typography>₹{Number(formData.price).toFixed(2)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">CGST ({formData.gst_rate/2}%)</Typography>
                <Typography>₹{gstPreview.cgst.toFixed(2)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">SGST ({formData.gst_rate/2}%)</Typography>
                <Typography>₹{gstPreview.sgst.toFixed(2)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                <Typography fontWeight="bold">₹{gstPreview.total.toFixed(2)}</Typography>
              </Box>
            </Box>
          </Paper>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ flex: 1 }}
          >
            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Product' : 'Add Product')}
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

export default ProductForm; 