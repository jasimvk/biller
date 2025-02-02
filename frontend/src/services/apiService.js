import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const apiService = {
  // Invoice CRUD
  async getInvoices(params = {}) {
    const response = await axios.get(`${BASE_URL}/invoices`, { params });
    return response.data;
  },

  async createInvoice(invoiceData) {
    const response = await axios.post(`${BASE_URL}/invoices`, invoiceData);
    return response.data;
  },

  async updateInvoice(id, invoiceData) {
    const response = await axios.put(`${BASE_URL}/invoices/${id}`, invoiceData);
    return response.data;
  },

  async deleteInvoice(id) {
    await axios.delete(`${BASE_URL}/invoices/${id}`);
  },

  // Customer CRUD
  async getCustomers() {
    const response = await axios.get(`${BASE_URL}/customers`);
    return response.data;
  },

  async createCustomer(customerData) {
    const response = await axios.post(`${BASE_URL}/customers`, customerData);
    return response.data;
  },

  async updateCustomer(id, customerData) {
    const response = await axios.put(`${BASE_URL}/customers/${id}`, customerData);
    return response.data;
  },

  async deleteCustomer(id) {
    await axios.delete(`${BASE_URL}/customers/${id}`);
  },

  // Product CRUD
  async getProducts() {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  },

  async createProduct(productData) {
    const response = await axios.post(`${BASE_URL}/products`, productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await axios.put(`${BASE_URL}/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    await axios.delete(`${BASE_URL}/products/${id}`);
  },

  // Business Settings
  async getBusinessDetails() {
    const response = await axios.get(`${BASE_URL}/business`);
    return response.data;
  },

  async updateBusinessDetails(businessData) {
    const response = await axios.put(`${BASE_URL}/business`, businessData);
    return response.data;
  },

  // GST Reports
  async getGSTReport(startDate, endDate) {
    const response = await axios.get(`${BASE_URL}/invoices/report`, {
      params: { startDate, endDate }
    });
    return response.data;
  }
}; 