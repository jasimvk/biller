import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Button,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { BusinessContext } from '../contexts/BusinessContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import CustomerService from '../services/customerService';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'add', customerId: null });
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentBusiness } = useContext(BusinessContext);

  useEffect(() => {
    if (!currentBusiness?.id) {
      navigate('/businesses');
      return;
    }
    fetchCustomers();
  }, [currentBusiness?.id, navigate]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CustomerService.fetchCustomers(currentBusiness.id);
      setCustomers(data);
    } catch (err) {
      console.error('Error in fetchCustomers:', err);
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setFormDialog({ open: true, mode: 'add', customerId: null });
  };

  const handleEditCustomer = (customerId) => {
    setFormDialog({ open: true, mode: 'edit', customerId });
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await CustomerService.deleteCustomer(customerId);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      showNotification('Customer deleted successfully', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (formDialog.mode === 'add') {
        await CustomerService.createCustomer({
          ...formData,
          business_id: currentBusiness.id
        });
      } else {
        await CustomerService.updateCustomer(formDialog.customerId, {
          ...formData,
          business_id: currentBusiness.id
        });
      }
      
      await fetchCustomers();
      setFormDialog({ open: false, mode: 'add', customerId: null });
      showNotification(
        `Customer ${formDialog.mode === 'add' ? 'added' : 'updated'} successfully`,
        'success'
      );
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Show business selection prompt if no business is selected
  if (!currentBusiness?.id) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please Select a Business
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You need to select a business before managing customers.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/businesses')}
        >
          Select Business
        </Button>
      </Container>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading customers..." />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link component={RouterLink} to="/" color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/businesses" color="inherit">
            {currentBusiness.tradeName}
          </Link>
          <Typography color="text.primary">Customers</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Customers
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {currentBusiness.tradeName}
          </Typography>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <CustomerList
            customers={customers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onAdd={handleAddCustomer}
          />
        )}

        <Dialog
          fullScreen={fullScreen}
          maxWidth="md"
          fullWidth
          open={formDialog.open}
          onClose={() => setFormDialog({ open: false, mode: 'add', customerId: null })}
        >
          <CustomerForm
            initialValues={
              formDialog.mode === 'edit'
                ? customers.find(c => c.id === formDialog.customerId)
                : {}
            }
            isEdit={formDialog.mode === 'edit'}
            onSubmit={handleSubmit}
            onCancel={() => setFormDialog({ open: false, mode: 'add', customerId: null })}
          />
        </Dialog>

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
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default Customers; 