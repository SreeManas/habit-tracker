# Push Notifications Setup Guide

## Overview

The app supports two types of notifications:

1. **Daily Reminders**: Scheduled notifications at 6pm, 9pm, and 12am to remind you to mark your habits
2. **Habit-Specific Reminders**: Notifications at specific times you set for individual habits

## Setup Steps

### 1. Enable Firebase Cloud Messaging (FCM)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Cloud Messaging**
4. Under **Web configuration**, click **Generate key pair** to create a VAPID key
5. Copy the VAPID key

### 2. Add VAPID Key to Environment Variables

Add to your `.env` file:
```
VITE_FIREBASE_VAPID_KEY=your-vapid-key-here
```

Or update `src/firebase/config.js` directly with your VAPID key.

### 3. Deploy Cloud Functions (for scheduled notifications)

The Cloud Functions handle scheduled notifications. To deploy:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize functions (if not already done)
cd functions
npm install
cd ..

# Deploy functions
firebase deploy --only functions
```

### 4. Configure Timezone

Edit `functions/index.js` and change the timezone in the scheduled functions:
```javascript
.timeZone('America/New_York') // Change to your timezone
```

### 5. Enable Notifications in Browser

1. Open the app
2. Go to **Stats** page
3. Scroll to **Notification Settings**
4. Click **Enable Notifications**
5. Allow notifications when prompted

### 6. Configure Notification Settings

- **Daily Reminders**: Toggle on/off
- **Reminder Times**: Add/remove times (default: 6pm, 9pm, 12am)
- **Enable All Notifications**: Master toggle

### 7. Set Habit Reminder Times

1. Go to **Habits** page
2. Create or edit a habit
3. Set **Reminder Time** (e.g., "09:00" for 9am)
4. Save the habit

You'll receive a notification at that time every day to complete that specific habit.

## How It Works

### Daily Reminders
- Cloud Functions run at scheduled times (6pm, 9pm, 12am)
- Checks which users have notifications enabled
- Sends notification if user has unmarked habits
- Works across all devices where user is logged in

### Habit-Specific Reminders
- Cloud Functions check every hour for habits with matching reminder times
- Sends notification to remind you to complete that specific habit
- Only sends if habit is not already marked as done

## Testing

### Test Daily Reminders
1. Set a reminder time to a few minutes from now
2. Wait for the scheduled function to run
3. Check your notifications

### Test Habit Reminders
1. Create a habit with reminder time set to current hour
2. Wait for the hourly function to run
3. Check your notifications

## Troubleshooting

### Notifications not working?
1. Check browser notification permissions
2. Verify FCM token is saved in user document
3. Check Cloud Functions logs: `firebase functions:log`
4. Verify VAPID key is correct
5. Check service worker is registered

### Service Worker Issues
- Make sure `firebase-messaging-sw.js` is in the `public/` folder
- Clear browser cache and reload
- Check browser console for errors

### Cloud Functions Not Running?
- Verify functions are deployed: `firebase functions:list`
- Check Firebase Console → Functions for errors
- Verify billing is enabled (required for scheduled functions)

## Security

- FCM tokens are stored in user documents
- Only the user can access their own tokens
- Notifications are sent only to authenticated users
- Service worker validates all messages

## Notes

- Notifications work even when app is closed (via service worker)
- Notifications work across all devices where user is logged in
- Users can disable notifications anytime in settings
- Reminder times use 24-hour format (HH:MM)
