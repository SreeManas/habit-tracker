import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // Create user document if it doesn't exist
          const newUserData = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            createdAt: new Date().toISOString(),
            totalXP: 0,
            identityScore: 0,
            level: 1
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
          setUserData(newUserData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    userData,
    loading,
    signInWithGoogle,
    signOut
  };
};
