import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Reset all user data - habits, daily logs, and user stats
 */
export const resetAllUserData = async (userId) => {
  try {
    // 1. Delete all habits
    const habitsQuery = query(
      collection(db, 'habits'),
      where('userId', '==', userId)
    );
    const habitsSnapshot = await getDocs(habitsQuery);
    const habitDeletes = habitsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(habitDeletes);
    console.log(`Deleted ${habitsSnapshot.docs.length} habits`);

    // 2. Delete all daily logs
    const logsQuery = query(
      collection(db, 'dailyLogs'),
      where('userId', '==', userId)
    );
    const logsSnapshot = await getDocs(logsQuery);
    const logDeletes = logsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(logDeletes);
    console.log(`Deleted ${logsSnapshot.docs.length} daily logs`);

    // 3. Reset user stats
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalXP: 0,
      identityScore: 0,
      level: 1,
      fcmTokens: [],
      notificationSettings: {
        dailyReminders: true,
        reminderTimes: ['18:00', '21:00', '00:00'],
        enabled: false
      }
    });
    console.log('User stats reset');

    return {
      success: true,
      habitsDeleted: habitsSnapshot.docs.length,
      logsDeleted: logsSnapshot.docs.length
    };
  } catch (error) {
    console.error('Error resetting user data:', error);
    throw error;
  }
};
