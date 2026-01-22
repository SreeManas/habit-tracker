# Discipline - Gamified Habit Tracker

A full-stack gamified habit and discipline tracking web application built with React, Vite, and Firebase.

## Features

### Core Systems

1. **Habit System**
   - Create habits with customizable difficulty levels
   - Each habit has XP value and penalty for missing
   - Difficulty levels: Easy, Medium, Hard, Extreme

2. **Daily Run System**
   - Mark habits as done, missed, or pending
   - Daily logs saved to Firestore
   - Real-time updates

3. **Game Mechanics**
   - **XP System**: Earn XP for completed habits, lose points for missed
   - **Level System**: Level up based on total XP (formula: level = floor(sqrt(XP/100)) + 1)
   - **Streak Tracking**: Track consecutive days for each habit
   - **Comeback Streaks**: Track recovery after failures
   - **Penalties**: Lose points when missing habits

4. **Identity System**
   - Daily question: "Did I act like the man I want to become today?"
   - Yes/No answer affects identity score
   - Builds long-term identity tracking

5. **Stats & Profile**
   - Daily score and completion percentage
   - Weekly summary
   - Best streaks per habit
   - Current level, XP progress bar
   - Identity score

## Tech Stack

- **Frontend**: React 19 + Vite
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Cloud Firestore
- **Routing**: React Router DOM
- **Deployment**: Ready for Vercel

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication
   - Create a Firestore database
   - Copy your Firebase config

3. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```

4. **Firestore Security Rules**
   Set up Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /habits/{habitId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       match /dailyLogs/{logId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Navbar.jsx
│   ├── HabitCard.jsx
│   ├── IdentityQuestion.jsx
│   └── ProtectedRoute.jsx
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Habits.jsx
│   └── Stats.jsx
├── hooks/           # Custom React hooks
│   ├── useAuth.js
│   ├── useHabits.js
│   ├── useDailyRun.js
│   └── useStats.js
├── services/        # Business logic services
│   └── gameService.js
├── utils/           # Utility functions
│   └── gameLogic.js
├── firebase/        # Firebase configuration
│   └── config.js
├── App.jsx          # Main app component with routing
├── App.css          # Main styles
└── main.jsx         # Entry point
```

## Firestore Schema

### Collections

**users/{userId}**
```javascript
{
  email: string,
  displayName: string,
  photoURL: string,
  createdAt: timestamp,
  totalXP: number,
  identityScore: number,
  level: number
}
```

**habits/{habitId}**
```javascript
{
  userId: string,
  name: string,
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme',
  xp: number,
  penalty: number,
  createdAt: timestamp
}
```

**dailyLogs/{userId}_{date}**
```javascript
{
  userId: string,
  date: string (YYYY-MM-DD),
  habits: {
    [habitId]: boolean | null
  },
  identityAnswer: boolean | null,
  completed: boolean
}
```

## Game Mechanics

### XP Calculation
- Completed habit: +XP (based on difficulty)
- Missed habit: -Penalty (based on difficulty)

### Level System
- Formula: `level = floor(sqrt(totalXP / 100)) + 1`
- XP required for next level: `(level^2) * 100`

### Streaks
- Current streak: Consecutive days with habit completed
- Comeback streak: Days completed after a failure

### Identity Score
- Increases by 1 for "Yes" answers
- Decreases by 1 for "No" answers (minimum 0)

## License

MIT
