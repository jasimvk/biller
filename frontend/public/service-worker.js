const CACHE_NAME = 'invoice-app-v1';
const API_CACHE = 'api-cache-v1';

const STATIC_URLS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json'
];

const API_ROUTES = [
  '/api/customers',
  '/api/products',
  '/api/invoices',
  '/api/business'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_URLS);
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-invoices') {
    event.waitUntil(syncInvoices());
  }
});

async function syncInvoices() {
  try {
    const db = await openDB('invoiceAppDB', 1);
    const syncQueue = await db.getAll('syncQueue');
    
    for (const item of syncQueue) {
      try {
        const response = await fetch(`http://localhost:5000${item.url}`, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        });

        if (response.ok) {
          await db.delete('syncQueue', item.id);
          
          // Update local data
          const result = await response.json();
          await db.put(item.storeName, result);
          
          // Show sync notification
          self.registration.showNotification('Sync Complete', {
            body: `Successfully synced ${item.storeName}`,
            icon: '/logo192.png'
          });
        }
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(event.request));
  }
});

async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    const cache = await caches.open(API_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
} 