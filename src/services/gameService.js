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
      
      console.log('Updating XP:', { userId, currentXP, xpChange, newXP, newLevel });
      
      await updateDoc(userRef, {
        totalXP: newXP,
        level: newLevel
      });
      
      console.log('XP update successful');
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
      
      console.log('Updating identity score:', { userId, currentScore, change, newScore });
      
      await updateDoc(userRef, {
        identityScore: newScore
      });
      
      console.log('Identity score update successful');
    } else {
      console.error('User document does not exist:', userId);
    }
  } catch (error) {
    console.error('Error updating identity score:', error);
    throw error;
  }
};

// Process daily log and update XP/identity
export const processDailyLog = async (userId, dailyLog, previousLog) => {
  // Calculate XP change from habits
  let xpChange = 0;
  
  if (previousLog) {
    // Remove previous XP contributions
    Object.entries(previousLog.habits || {}).forEach(([habitId, status]) => {
      // We need habit data to calculate, so this is simplified
      // In a real implementation, you'd fetch habit data
    });
  }
  
  // Add new XP contributions
  // This would require habit data, so we'll handle it in the component
  // that has access to habits
  
  // Update identity score if changed
  if (dailyLog.identityAnswer !== previousLog?.identityAnswer) {
    if (dailyLog.identityAnswer !== null && dailyLog.identityAnswer !== undefined) {
      await updateIdentityScore(userId, dailyLog.identityAnswer);
    }
  }
};
