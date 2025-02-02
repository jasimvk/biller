import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar,
  Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import InvoicePreview from '../components/InvoicePreview';
import {
  calculateGSTComponents,
  calculateInvoiceTotals,
  isValidAmount,
  isValidGSTRate
} from '../utils/gstCalculator';
import { validateHSNCode, validateGSTRateForHSN, getDefaultGSTRate } from '../utils/hsnValidator';
import { debounce } from 'lodash';
import { useDataFetching } from '../hooks/useDataFetching';
import { validateInvoice, validateProduct } from '../utils/validation';

function CreateInvoice() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    place_of_supply: '',
    reverse_charge: false,
    items: []
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Use the custom hook for data fetching
  const { 
    data: customersData, 
    loading: customersLoading, 
    error: customersError 
  } = useDataFetching('customers');

  const { 
    data: productsData, 
    loading: productsLoading, 
    error: productsError 
  } = useDataFetching('products');

  const { 
    data: businessData, 
    loading: businessLoading, 
    error: businessError 
  } = useDataFetching('business');

  // Debounced GST calculation to improve performance
  const debouncedCalculateGST = useCallback(
    debounce((items, placeOfSupply) => {
      try {
        return calculateInvoiceTotals(items, placeOfSupply);
      } catch (error) {
        showNotification('Error calculating GST', 'error');
        return null;
      }
    }, 300),
    []
  );

  // Show notification helper
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Enhanced fetch with error handling
  const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Fetch error: ${error.message}`);
      throw error;
    }
  };

  // Enhanced data fetching
  const fetchInitialData = async () => {
    setInitialLoading(true);
    try {
      const [customersData, productsData, businessData] = await Promise.all([
        fetchData('http://localhost:5000/api/customers'),
        fetchData('http://localhost:5000/api/products'),
        fetchData('http://localhost:5000/api/business')
      ]);

      setCustomers(customersData.customers);
      setProducts(productsData.products);
      setBusiness(businessData.business);
    } catch (error) {
      setError('Failed to load initial data. Please refresh the page.');
      showNotification('Failed to load data', 'error');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        product_id: '',
        quantity: 1,
        unit_price: 0,
        gst_rate: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0
      }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Enhanced item change handler
  const handleItemChange = async (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'product_id') {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        try {
          await validateProduct(product);
          newItems[index] = {
            ...newItems[index],
            unit_price: product.price,
            gst_rate: product.gst_rate,
            hsn_code: product.hsn_code
          };
          showNotification('Product details updated', 'success');
        } catch (error) {
          showNotification(error.message, 'error');
          return;
        }
      }
    }

    // Validate and calculate GST
    try {
      const gstComponents = await debouncedCalculateGST(
        newItems[index].quantity * newItems[index].unit_price,
        newItems[index].gst_rate,
        formData.place_of_supply
      );
      
      if (gstComponents) {
        newItems[index] = {
          ...newItems[index],
          ...gstComponents
        };
        setFormData({ ...formData, items: newItems });
      }
    } catch (error) {
      showNotification('Error calculating GST', 'error');
    }
  };

  // Form validation
  const validateForm = async () => {
    const validation = validateInvoice(formData);
    if (!validation.isValid) {
      showNotification(validation.errors.join('\n'), 'error');
      return false;
    }
    return true;
  };

  // Enhanced submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      
      // Validate form
      const isValid = await validateForm();
      if (!isValid) return;

      // Submit data
      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      showNotification('Invoice created successfully', 'success');
      navigate('/invoices');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    try {
      return calculateInvoiceTotals(formData.items, formData.place_of_supply);
    } catch (error) {
      console.error('Error calculating totals:', error);
      return {
        taxableAmount: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        totalAmount: 0
      };
    }
  };

  const handlePreview = () => {
    if (!business) return;
    
    const totals = calculateTotals();
    const previewInvoice = {
      ...formData,
      invoice_number: 'DRAFT',
      total_taxable_amount: totals.taxableAmount,
      total_cgst: totals.cgstAmount,
      total_sgst: totals.sgstAmount,
      total_igst: totals.igstAmount,
      total_amount: totals.totalAmount,
      items: formData.items.map(item => ({
        ...item,
        product_name: products.find(p => p.id === parseInt(item.product_id))?.name,
        hsn_code: products.find(p => p.id === parseInt(item.product_id))?.hsn_code,
        ...calculateGSTComponents(
          item.quantity * item.unit_price,
          item.gst_rate,
          formData.place_of_supply
        )
      }))
    };
    setPreviewData(previewInvoice);
    setPreviewOpen(true);
  };

  return (
    <>
      {initialLoading ? (
        <Backdrop open={true}>
          <CircularProgress />
        </Backdrop>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box component={Paper} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Create New Invoice</Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Customer"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  required
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.gstin || 'No GSTIN'})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Place of Supply"
                  value={formData.place_of_supply}
                  onChange={(e) => setFormData({ ...formData, place_of_supply: e.target.value })}
                  required
                >
                  <MenuItem value="same_state">Same State</MenuItem>
                  <MenuItem value="other_state">Other State</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  fullWidth
                  label="Invoice Date"
                  value={formData.invoice_date}
                  onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  fullWidth
                  label="Due Date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>HSN</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>GST Rate</TableCell>
                    <TableCell>CGST</TableCell>
                    <TableCell>SGST</TableCell>
                    <TableCell>IGST</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.items.map((item, index) => {
                    const product = products.find(p => p.id === parseInt(item.product_id));
                    const gstComponents = calculateGSTComponents(
                      item.quantity * item.unit_price,
                      item.gst_rate,
                      formData.place_of_supply
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            select
                            fullWidth
                            value={item.product_id}
                            onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                            required
                          >
                            {products.map((product) => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell>{product?.hsn_code || ''}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            inputProps={{ min: 1 }}
                            required
                          />
                        </TableCell>
                        <TableCell>₹{item.unit_price.toFixed(2)}</TableCell>
                        <TableCell>{item.gst_rate}%</TableCell>
                        <TableCell>₹{gstComponents.cgstAmount.toFixed(2)}</TableCell>
                        <TableCell>₹{gstComponents.sgstAmount.toFixed(2)}</TableCell>
                        <TableCell>₹{gstComponents.igstAmount.toFixed(2)}</TableCell>
                        <TableCell>₹{gstComponents.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveItem(index)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Invoice Summary</Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(calculateTotals()).map(([key, value]) => (
                    <Typography key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: ₹{value.toFixed(2)}
                    </Typography>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <Button 
                  sx={{ mr: 2 }}
                  onClick={() => navigate('/invoices')}
                >
                  Cancel
                </Button>
                <Button sx={{ mr: 2 }} onClick={handlePreview}>
                  Preview
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formData.items.length === 0}
                >
                  Create Invoice
                </Button>
              </Grid>
            </Grid>
          </form>

          {previewData && (
            <InvoicePreview
              open={previewOpen}
              onClose={() => setPreviewOpen(false)}
              invoice={previewData}
              business={business}
              customer={customers.find(c => c.id === parseInt(formData.customer_id))}
            />
          )}
        </Box>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CreateInvoice; 