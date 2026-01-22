# Setup Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Firebase Setup**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication → Sign-in method → Google (enable it)
   - Create Firestore Database (start in test mode, then add security rules)
   - Go to Project Settings → General → Your apps → Web app
   - Copy the Firebase configuration

3. **Environment Variables**
   - Create a `.env` file in the root directory
   - Add your Firebase config:
     ```
     VITE_FIREBASE_API_KEY=your-api-key-here
     VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```

4. **Firestore Security Rules**
   - In Firebase Console, go to Firestore Database → Rules
   - Copy the rules from `firestore.rules` file
   - Paste and publish

5. **Run the app**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add all environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy!

The app will automatically build and deploy.

## Features Overview

- **Login**: Google authentication
- **Dashboard**: Today's habit tracking with identity question
- **Habits**: Create, edit, delete habits with difficulty levels
- **Stats**: View your progress, streaks, level, and identity score

## Game Mechanics

- **XP**: Earn XP for completed habits, lose points for missed
- **Levels**: Level up based on total XP
- **Streaks**: Track consecutive days per habit
- **Identity**: Daily question affects identity score

Enjoy building discipline! ⚔️
