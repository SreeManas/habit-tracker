/**
 * Firebase Cloud Functions for Scheduled Notifications
 * 
 * To deploy these functions:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login: firebase login
 * 3. Initialize: firebase init functions
 * 4. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Scheduled function to send daily reminder notifications
 * Runs at 6pm, 9pm, and 12am (configured in Firebase Console)
 */
exports.sendDailyReminders = functions.pubsub
  .schedule('0 18,21,0 * * *') // 6pm, 9pm, 12am daily
  .timeZone('America/New_York') // Change to your timezone
  .onRun(async (_context) => {
    const db = admin.firestore();
    const now = new Date();
    const currentHour = now.getHours();

    // Determine which reminder time this is
    let reminderTime;
    if (currentHour === 18) reminderTime = '18:00';
    else if (currentHour === 21) reminderTime = '21:00';
    else if (currentHour === 0) reminderTime = '00:00';
    else return null;

    try {
      // Get all users with notifications enabled
      const usersSnapshot = await db.collection('users')
        .where('notificationSettings.enabled', '==', true)
        .where('notificationSettings.dailyReminders', '==', true)
        .get();


      const messages = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const fcmTokens = userData.fcmTokens || [];
        const reminderTimes = userData.notificationSettings?.reminderTimes || [];

        // Check if this user wants reminders at this time
        if (!reminderTimes.includes(reminderTime)) continue;

        // Get user's habits
        const habitsSnapshot = await db.collection('habits')
          .where('userId', '==', userDoc.id)
          .get();

        if (habitsSnapshot.empty) continue;

        // Check today's log to see if habits are marked
        const today = new Date().toISOString().split('T')[0];
        const todayLogRef = db.collection('dailyLogs').doc(`${userDoc.id}_${today}`);
        const todayLog = await todayLogRef.get();

        const habits = habitsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Count unmarked habits
        const unmarkedHabits = habits.filter(habit => {
          const status = todayLog.exists() ? todayLog.data().habits?.[habit.id] : null;
          return status === null || status === undefined;
        });

        if (unmarkedHabits.length > 0) {
          const message = {
            notification: {
              title: '⏰ Time to Mark Your Habits',
              body: `You have ${unmarkedHabits.length} habit${unmarkedHabits.length > 1 ? 's' : ''} to mark for today. Stay disciplined!`
            },
            data: {
              url: '/dashboard',
              type: 'daily_reminder'
            }
          };

          // Send to all user's devices
          fcmTokens.forEach(token => {
            messages.push({
              token,
              ...message
            });
          });
        }
      }

      // Send all notifications
      if (messages.length > 0) {
        const responses = await admin.messaging().sendEach(messages);
        console.log(`Sent ${responses.successCount} notifications`);
      }

      return null;
    } catch (error) {
      console.error('Error sending daily reminders:', error);
      return null;
    }
  });

/**
 * Scheduled function to send habit-specific reminder notifications
 * Runs every hour to check for habit reminder times
 */
exports.sendHabitReminders = functions.pubsub
  .schedule('0 * * * *') // Every hour
  .timeZone('America/New_York') // Change to your timezone
  .onRun(async (_context) => {
    const db = admin.firestore();
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    try {
      // Get all habits with reminder times matching current time
      const habitsSnapshot = await db.collection('habits')
        .where('reminderTime', '==', currentTime)
        .get();

      if (habitsSnapshot.empty) return null;

      const messages = [];

      for (const habitDoc of habitsSnapshot.docs) {
        const habit = habitDoc.data();

        // Get user
        const userDoc = await db.collection('users').doc(habit.userId).get();
        if (!userDoc.exists) continue;

        const userData = userDoc.data();
        const fcmTokens = userData.fcmTokens || [];

        // Check if user has notifications enabled
        if (!userData.notificationSettings?.enabled) continue;

        // Check if habit is already completed today
        const today = new Date().toISOString().split('T')[0];
        const todayLogRef = db.collection('dailyLogs').doc(`${habit.userId}_${today}`);
        const todayLog = await todayLogRef.get();

        const status = todayLog.exists() ? todayLog.data().habits?.[habitDoc.id] : null;
        if (status === true) continue; // Already completed

        const message = {
          notification: {
            title: `🔔 Reminder: ${habit.name}`,
            body: `Time to complete "${habit.name}"! Mark it as done when you're finished.`
          },
          data: {
            url: '/dashboard',
            type: 'habit_reminder',
            habitId: habitDoc.id
          }
        };

        // Send to all user's devices
        fcmTokens.forEach(token => {
          messages.push({
            token,
            ...message
          });
        });
      }

      // Send all notifications
      if (messages.length > 0) {
        const responses = await admin.messaging().sendEach(messages);
        console.log(`Sent ${responses.successCount} habit reminder notifications`);
      }

      return null;
    } catch (error) {
      console.error('Error sending habit reminders:', error);
      return null;
    }
  });
