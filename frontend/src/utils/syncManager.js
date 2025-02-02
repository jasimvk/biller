export const SyncManager = {
  async saveOffline(storeName, data) {
    try {
      // Add timestamp for conflict resolution
      const timestamp = Date.now();
      const dataWithTimestamp = {
        data,
        timestamp,
        syncStatus: 'pending'
      };

      localStorage.setItem(`${storeName}`, JSON.stringify(dataWithTimestamp));
      
      // Queue for sync if it's an invoice
      if (storeName === 'invoices') {
        const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
        syncQueue.push({
          id: data.id || `temp_${timestamp}`,
          storeName,
          data,
          timestamp
        });
        localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
      }
      
      return true;
    } catch (error) {
      console.error('Error saving offline data:', error);
      return false;
    }
  },

  async getOfflineData(storeName) {
    try {
      const data = localStorage.getItem(`${storeName}`);
      if (!data) return null;
      
      const parsedData = JSON.parse(data);
      return parsedData.data;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  },

  async syncPendingInvoices() {
    try {
      const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
      
      for (const item of syncQueue) {
        if (item.storeName === 'invoices') {
          try {
            const response = await fetch('http://localhost:5000/api/invoices', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data)
            });

            if (response.ok) {
              // Remove from sync queue after successful sync
              const updatedQueue = syncQueue.filter(q => q.id !== item.id);
              localStorage.setItem('syncQueue', JSON.stringify(updatedQueue));
            }
          } catch (error) {
            console.error('Sync failed for invoice:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error syncing pending invoices:', error);
    }
  },

  async clearOfflineData() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  }
}; 