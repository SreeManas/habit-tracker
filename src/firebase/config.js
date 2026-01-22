import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAK5-_fEoSjboghVjI_fdABieK9CAIdOyQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "habit-tracker-9b38e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "habit-tracker-9b38e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "habit-tracker-9b38e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "132986672647",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:132986672647:web:28ded9b5c7dc11b85abca2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7197R4KZX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Messaging (only in browser environment)
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase Messaging initialization failed:', error);
  }
}

export { analytics, messaging };
export default app;
