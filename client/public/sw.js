// Service Worker for Push Notifications
const CACHE_NAME = 'sharewheelz-v1';
const urlsToCache = [
  '/',
  '/login',
  '/register',
  '/cars'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'ShareWheelz';
  const options = {
    body: data.message || 'You have a new notification',
    icon: '/assets/sharewheelz-logo.png',
    badge: '/assets/sharewheelz-logo.png',
    tag: data.tag || 'notification',
    data: data.data || {},
    requireInteraction: false,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  event.notification.close();

  const data = event.notification.data;
  const action = event.action;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If there's an action, handle it
        if (action === 'view') {
          // Open or focus the app
          const url = data.url || '/';
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        }
        // Default: open or focus the app
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Background sync event (for offline support)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  if (event.tag === 'sync-messages') {
    event.waitUntil(
      // Sync messages when back online
      fetch('/api/messages/sync')
        .then((response) => response.json())
        .catch((error) => {
          console.error('Background sync failed:', error);
        })
    );
  }
});

