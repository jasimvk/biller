import { useState, useCallback } from 'react';
import { GSTService } from '../services/gstService';
import { apiService } from '../services/apiService';

export const useInvoice = (businessState) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createInvoice = useCallback(async (invoiceData) => {
    setLoading(true);
    try {
      const gstCalculations = GSTService.calculateInvoiceTotals(invoiceData, businessState);
      const { isValid, errors } = GSTService.validateGSTComponents({
        ...invoiceData,
        ...gstCalculations
      });

      if (!isValid) {
        throw new Error(`GST validation failed: ${errors.join(', ')}`);
      }

      const finalInvoice = {
        ...invoiceData,
        ...gstCalculations,
        business_state: businessState
      };

      const response = await apiService.createInvoice(finalInvoice);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [businessState]);

  return {
    loading,
    error,
    createInvoice
  };
}; 