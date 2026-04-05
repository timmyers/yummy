// Yummy Garden Service Worker
const CACHE_NAME = 'yummy-garden-v1';
const STORAGE_KEY = 'yummy-garden-data';

const NOTIFICATION_MESSAGES = [
  { title: "Your garden misses you! 🌸", body: "Time for a little snack? Even something small helps your garden grow." },
  { title: "Hey lovely! 🦋", body: "It's been a while — nourish yourself and watch your garden bloom." },
  { title: "Snack o'clock! 🍓", body: "Your flowers are getting thirsty. Feed them with a yummy bite!" },
  { title: "Garden check-in 🌺", body: "A little nourishment goes a long way. What sounds good right now?" },
  { title: "Bloom reminder 🌷", body: "You deserve something delicious. Your garden is waiting for you!" },
  { title: "Time to eat, beautiful! 💖", body: "Even a small meal makes your garden grow. You've got this!" },
];

// Cache app files for offline use
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

// Handle notification clicks — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      return self.clients.openWindow('/');
    })
  );
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
    // Store reminder schedule info
    const { intervalMs } = event.data;
    scheduleReminder(intervalMs);
  }
});

// Periodic reminder check using setInterval in the SW
let reminderInterval = null;

function scheduleReminder(intervalMs) {
  if (reminderInterval) clearInterval(reminderInterval);
  reminderInterval = setInterval(() => {
    checkAndNotify();
  }, intervalMs);
}

async function checkAndNotify() {
  // Only notify if no client windows are focused
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const anyFocused = clients.some(c => c.visibilityState === 'visible');

  // Still send notification even if app is open but not focused
  const msg = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];

  self.registration.showNotification(msg.title, {
    body: msg.body,
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌸</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌸</text></svg>',
    tag: 'yummy-reminder',
    renotify: true,
    requireInteraction: false,
    silent: false,
  });
}
