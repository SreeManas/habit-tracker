// Service Worker for Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAK5-_fEoSjboghVjI_fdABieK9CAIdOyQ",
  authDomain: "habit-tracker-9b38e.firebaseapp.com",
  projectId: "habit-tracker-9b38e",
  storageBucket: "habit-tracker-9b38e.firebasestorage.app",
  messagingSenderId: "132986672647",
  appId: "1:132986672647:web:28ded9b5c7dc11b85abca2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Discipline Tracker';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new reminder',
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: payload.data?.habitId || 'general',
    requireInteraction: true,
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
