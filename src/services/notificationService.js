import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return null;
  }

  if (Notification.permission === 'granted') {
    return await getFCMToken();
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return await getFCMToken();
    }
  }

  return null;
};

// Get FCM token
export const getFCMToken = async () => {
  if (!messaging) {
    console.warn('Firebase Messaging is not initialized');
    return null;
  }

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'BBXbVS30RoNVGq4Co1SJwpEG-BKenfFWpOTyBaKpY_ThKhCNcKhjGCIBu_Qb7d41MqMT8J3hthI7qwnbyNM6flg',
      serviceWorkerRegistration: registration
    });

    if (token) {
      console.log('FCM Token:', token);
      return token;
    } else {
      console.warn('No FCM token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Save FCM token to user document
export const saveFCMToken = async (userId, token) => {
  if (!token) return;

  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentTokens = userDoc.data().fcmTokens || [];
      if (!currentTokens.includes(token)) {
        await updateDoc(userRef, {
          fcmTokens: [...currentTokens, token]
        });
      }
    }
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

// Remove FCM token when user logs out
export const removeFCMToken = async (userId, token) => {
  if (!token) return;

  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentTokens = userDoc.data().fcmTokens || [];
      const updatedTokens = currentTokens.filter(t => t !== token);
      
      await updateDoc(userRef, {
        fcmTokens: updatedTokens
      });
    }
  } catch (error) {
    console.error('Error removing FCM token:', error);
  }
};

// Listen for foreground messages
export const setupForegroundMessageListener = (callback) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    
    // Show notification even when app is in foreground
    if (Notification.permission === 'granted') {
      new Notification(payload.notification?.title || 'Discipline Tracker', {
        body: payload.notification?.body,
        icon: '/vite.svg',
        tag: payload.data?.habitId || 'general',
        data: payload.data
      });
    }
    
    if (callback) {
      callback(payload);
    }
  });
};

// Check notification permission status
export const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};
