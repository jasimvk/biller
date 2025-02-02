import { API_BASE_URL } from '../config';

class CustomerService {
  static async fetchCustomers(businessId) {
    try {
      console.log(`[API] Fetching customers for business: ${businessId}`);
      const response = await fetch(`${API_BASE_URL}/customers?business_id=${businessId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch customers');
      }
      
      const data = await response.json();
      console.log('[API] Customers data:', data);
      return data.data || [];
    } catch (error) {
      console.error('[API] Error fetching customers:', error);
      throw error;
    }
  }

  static async createCustomer(customerData) {
    try {
      console.log('[API] Creating customer:', customerData);
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create customer');
      }

      const data = await response.json();
      console.log('[API] Created customer:', data);
      return data.data;
    } catch (error) {
      console.error('[API] Error creating customer:', error);
      throw error;
    }
  }

  static async updateCustomer(customerId, customerData) {
    try {
      console.log(`[API] Updating customer ${customerId}:`, customerData);
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update customer');
      }

      const data = await response.json();
      console.log('[API] Updated customer:', data);
      return data.data;
    } catch (error) {
      console.error('[API] Error updating customer:', error);
      throw error;
    }
  }

  static async deleteCustomer(customerId) {
    try {
      console.log(`[API] Deleting customer: ${customerId}`);
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete customer');
      }

      console.log('[API] Customer deleted successfully');
      return true;
    } catch (error) {
      console.error('[API] Error deleting customer:', error);
      throw error;
    }
  }
}

export default CustomerService; 