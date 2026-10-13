/* Service Worker - لوحة تحكم مجموعة فاروق v2
 * تخزين مؤقت + إشعارات المواعيد
 */
const CACHE_NAME = 'farouk-admin-v2';
const SHELL = [
  './admin.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(SHELL).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (
    url.hostname.includes('workers.dev') ||
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('googleusercontent.com')
  ) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          if (res && res.status === 200 && event.request.method === 'GET') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached || caches.match('./admin.html'));
    })
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SHOW_NOTIFICATION') {
    const title = data.title || 'تذكير — مجموعة فاروق';
    const options = {
      body: data.body || '',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: data.tag || 'farouk-reminder',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: { url: './admin.html' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
  if (data.type === 'SCHEDULE_APPS' && Array.isArray(data.appointments)) {
    event.waitUntil(scheduleFutureNotifications(data.appointments));
  }
});

async function scheduleFutureNotifications(apps) {
  const now = Date.now();
  for (const a of apps) {
    if (!a.date || !a.time || !a.id) continue;
    try {
      const ts = new Date(a.date + 'T' + a.time + ':00').getTime();
      if (isNaN(ts) || ts <= now) continue;
      const tag = 'app-' + a.id;
      const opts = {
        body: a.title + (a.time ? ' — الساعة ' + a.time : ''),
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag: tag,
        requireInteraction: true,
        data: { url: './admin.html', appId: a.id }
      };
      // Timestamp Trigger إن وُجد (Chrome Android)
      if (typeof TimestampTrigger !== 'undefined') {
        opts.showTrigger = new TimestampTrigger(ts);
        await self.registration.showNotification('موعد قادم — مجموعة فاروق', opts);
      }
    } catch (e) {}
  }
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './admin.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.indexOf('admin') !== -1 && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
