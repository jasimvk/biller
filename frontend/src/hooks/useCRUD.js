import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';

export const useCRUD = (entityType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await apiService[`get${entityType}`](params);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  const create = useCallback(async (itemData) => {
    setLoading(true);
    try {
      const response = await apiService[`create${entityType}`](itemData);
      setData(prev => [...prev, response]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  const update = useCallback(async (id, itemData) => {
    setLoading(true);
    try {
      const response = await apiService[`update${entityType}`](id, itemData);
      setData(prev => prev.map(item => item.id === id ? response : item));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  const remove = useCallback(async (id) => {
    setLoading(true);
    try {
      await apiService[`delete${entityType}`](id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  return {
    data,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    setData
  };
}; 