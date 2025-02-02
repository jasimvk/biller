import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Container,
  Paper
} from '@mui/material';
import ProductForm from '../components/ProductForm';
import { productService } from '../services/productService';

function AddProduct() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (productData) => {
    try {
      await productService.addProduct(productData);
      setNotification({
        open: true,
        message: 'Product added successfully!',
        severity: 'success'
      });
      // Navigate to products list after successful addition
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Error adding product',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Product
        </Typography>
        
        <Paper elevation={3} sx={{ mt: 3 }}>
          <ProductForm onSubmit={handleSubmit} />
        </Paper>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default AddProduct; 