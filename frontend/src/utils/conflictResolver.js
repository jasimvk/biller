export class ConflictResolver {
  static async resolveConflicts(localData, serverData, strategy = 'lastModifiedWins') {
    switch (strategy) {
      case 'lastModifiedWins':
        return this.resolveByLastModified(localData, serverData);
      case 'serverWins':
        return serverData;
      case 'localWins':
        return localData;
      case 'merge':
        return this.mergeData(localData, serverData);
      default:
        return serverData;
    }
  }

  static async resolveByLastModified(localData, serverData) {
    if (Array.isArray(localData) && Array.isArray(serverData)) {
      const mergedMap = new Map();
      
      // Combine both arrays and keep the latest version of each item
      [...localData, ...serverData].forEach(item => {
        const existingItem = mergedMap.get(item.id);
        if (!existingItem || new Date(item.updatedAt) > new Date(existingItem.updatedAt)) {
          mergedMap.set(item.id, item);
        }
      });

      return Array.from(mergedMap.values());
    }

    // For single objects
    return new Date(localData.updatedAt) > new Date(serverData.updatedAt) 
      ? localData 
      : serverData;
  }

  static async mergeData(localData, serverData) {
    if (Array.isArray(localData) && Array.isArray(serverData)) {
      const mergedMap = new Map();
      
      // Merge arrays while preserving unique fields from both versions
      [...localData, ...serverData].forEach(item => {
        const existingItem = mergedMap.get(item.id);
        if (existingItem) {
          mergedMap.set(item.id, {
            ...existingItem,
            ...item,
            // Preserve local changes for specific fields if needed
            localChanges: existingItem.localChanges || [],
            conflicts: this.detectConflicts(existingItem, item)
          });
        } else {
          mergedMap.set(item.id, item);
        }
      });

      return Array.from(mergedMap.values());
    }

    // For single objects
    return {
      ...serverData,
      ...localData,
      conflicts: this.detectConflicts(localData, serverData)
    };
  }

  static detectConflicts(localData, serverData) {
    const conflicts = [];
    Object.keys(localData).forEach(key => {
      if (localData[key] !== serverData[key]) {
        conflicts.push({
          field: key,
          localValue: localData[key],
          serverValue: serverData[key]
        });
      }
    });
    return conflicts;
  }

  static async resolveFieldConflict(field, localValue, serverValue, strategy = 'lastModifiedWins') {
    // Add custom resolution logic for specific fields
    switch (field) {
      case 'price':
        return Math.max(localValue, serverValue);
      case 'quantity':
        return strategy === 'lastModifiedWins' ? localValue : serverValue;
      case 'status':
        return this.resolveStatusConflict(localValue, serverValue);
      default:
        return strategy === 'lastModifiedWins' ? localValue : serverValue;
    }
  }

  static resolveStatusConflict(localStatus, serverStatus) {
    // Define status priority
    const statusPriority = {
      'draft': 0,
      'pending': 1,
      'processing': 2,
      'completed': 3,
      'cancelled': 4
    };

    // Return status with higher priority
    return statusPriority[localStatus] > statusPriority[serverStatus] 
      ? localStatus 
      : serverStatus;
  }
} 