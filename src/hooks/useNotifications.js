import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  requestNotificationPermission,
  saveFCMToken,
  removeFCMToken,
  setupForegroundMessageListener,
  getNotificationPermission
} from '../services/notificationService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useNotifications = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState('default');
  const [fcmToken, setFcmToken] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    dailyReminders: true,
    reminderTimes: ['18:00', '21:00', '00:00'], // 6pm, 9pm, 12am
    enabled: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadSettings = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.notificationSettings) {
            setNotificationSettings(data.notificationSettings);
          }
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        setLoading(false);
      }
    };

    const initNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          await saveFCMToken(user.uid, token);
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    // Check permission status
    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);

    // Load notification settings
    loadSettings();

    // Request permission and get token if not already granted
    if (currentPermission !== 'denied') {
      initNotifications();
    }

    // Setup foreground message listener
    setupForegroundMessageListener((payload) => {
      console.log('Notification received:', payload);
    });

    return () => {
      // Cleanup if needed
    };
  }, [user]);

  const updateNotificationSettings = useCallback(async (newSettings) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        notificationSettings: newSettings
      });
      setNotificationSettings(newSettings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }, [user]);

  const enableNotifications = useCallback(async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setFcmToken(token);
      setPermission('granted');
      if (user) {
        await saveFCMToken(user.uid, token);
        await updateNotificationSettings({
          ...notificationSettings,
          enabled: true
        });
      }
    } else {
      setPermission('denied');
    }
  }, [user, notificationSettings, updateNotificationSettings]);

  const disableNotifications = useCallback(async () => {
    if (user && fcmToken) {
      await removeFCMToken(user.uid, fcmToken);
    }
    await updateNotificationSettings({
      ...notificationSettings,
      enabled: false
    });
  }, [user, fcmToken, notificationSettings, updateNotificationSettings]);

  return {
    permission,
    fcmToken,
    notificationSettings,
    loading,
    enableNotifications,
    disableNotifications,
    updateNotificationSettings,
    getNotificationPermission
  };
};
