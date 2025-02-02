import { useState, useEffect, useCallback } from 'react';
import { SyncManager } from '../utils/syncManager';
import { CompressionUtil } from '../utils/compression';
import { ConflictResolver } from '../utils/conflictResolver';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const cache = {
  data: new Map(),
  timestamp: new Map()
};

export const useDataFetching = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { dependencies = [], validateData, transform } = options;
  const [syncStatus, setSyncStatus] = useState('idle');
  const [conflicts, setConflicts] = useState([]);
  const [syncRegistration, setSyncRegistration] = useState(null);

  const isCacheValid = (key) => {
    const timestamp = cache.timestamp.get(key);
    return timestamp && Date.now() - timestamp < CACHE_DURATION;
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setSyncStatus('syncing');

      if (isOffline) {
        const compressedData = await SyncManager.getOfflineData(endpoint);
        const offlineData = CompressionUtil.decompress(compressedData);
        setData(offlineData);
        setSyncStatus('offline');
        return;
      }

      // Register for background sync
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        setSyncRegistration(registration);
        
        // Register sync
        await registration.sync.register('sync-invoices');
      }

      const response = await fetch(`http://localhost:5000/api/${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      let serverData = await response.json();

      // Get local data and resolve conflicts
      const compressedLocalData = await SyncManager.getOfflineData(endpoint);
      const localData = CompressionUtil.decompress(compressedLocalData);

      if (localData) {
        const resolvedData = await ConflictResolver.resolveConflicts(
          localData,
          serverData,
          options.conflictStrategy
        );

        // Check for unresolved conflicts
        const conflicts = ConflictResolver.detectConflicts(localData, serverData);
        setConflicts(conflicts);

        serverData = resolvedData;
      }

      if (transform) {
        serverData = transform(serverData);
      }

      if (validateData) {
        const validationResult = validateData(serverData);
        if (!validationResult.isValid) {
          throw new Error(validationResult.error);
        }
      }

      // Compress and save to IndexedDB
      const compressedData = CompressionUtil.compress(serverData);
      await SyncManager.saveOffline(endpoint, compressedData);

      setData(serverData);
      setError(null);
      setSyncStatus('synced');
    } catch (err) {
      setError(err.message);
      setSyncStatus('error');
      
      // Fallback to offline data
      const compressedData = await SyncManager.getOfflineData(endpoint);
      if (compressedData) {
        const offlineData = CompressionUtil.decompress(compressedData);
        setData(offlineData);
        setSyncStatus('offline');
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, transform, validateData, isOffline, options.conflictStrategy]);

  const invalidateCache = useCallback(() => {
    cache.data.delete(endpoint);
    cache.timestamp.delete(endpoint);
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  useEffect(() => {
    if (syncRegistration) {
      syncRegistration.sync.getTags().then(tags => {
        const hasPendingSync = tags.includes('sync-invoices');
        setSyncStatus(hasPendingSync ? 'pending' : 'synced');
      });
    }
  }, [syncRegistration]);

  return {
    data,
    loading,
    error,
    isOffline,
    syncStatus,
    conflicts,
    refetch: () => fetchData(true),
    invalidateCache,
    resolveConflict: async (field, resolution) => {
      if (!data || !conflicts.length) return;
      
      const resolvedValue = await ConflictResolver.resolveFieldConflict(
        field,
        resolution.localValue,
        resolution.serverValue,
        options.conflictStrategy
      );

      // Update the data with resolved conflict
      const updatedData = {
        ...data,
        [field]: resolvedValue
      };

      setData(updatedData);
      setConflicts(conflicts.filter(c => c.field !== field));

      // Save resolved data
      const compressedData = CompressionUtil.compress(updatedData);
      await SyncManager.saveOffline(endpoint, compressedData);
    },
    registerSync: async () => {
      if (syncRegistration) {
        await syncRegistration.sync.register('sync-invoices');
        setSyncStatus('pending');
      }
    }
  };
}; 