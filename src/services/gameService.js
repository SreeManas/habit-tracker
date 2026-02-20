import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { calculateLevel } from '../utils/gameLogic';

// Update user XP and level when habits are completed
export const updateUserXP = async (userId, xpChange) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentXP = userDoc.data().totalXP || 0;
      const newXP = Math.max(0, currentXP + xpChange);
      const newLevel = calculateLevel(newXP);

      await updateDoc(userRef, {
        totalXP: newXP,
        level: newLevel
      });
    } else {
      console.error('User document does not exist:', userId);
    }
  } catch (error) {
    console.error('Error updating user XP:', error);
    throw error;
  }
};

// Update identity score with a change value
export const updateIdentityScore = async (userId, change) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentScore = userDoc.data().identityScore || 0;
      const newScore = Math.max(0, currentScore + change);

      await updateDoc(userRef, {
        identityScore: newScore
      });
    } else {
      console.error('User document does not exist:', userId);
    }
  } catch (error) {
    console.error('Error updating identity score:', error);
    throw error;
  }
};
