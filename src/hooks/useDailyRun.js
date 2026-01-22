import { useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';
import { useHabits } from './useHabits';
import { getDateString } from '../utils/gameLogic';
import { updateUserXP, updateIdentityScore } from '../services/gameService';

export const useDailyRun = () => {
  const { user } = useAuth();
  const { habits } = useHabits();
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [identityAnswer, setIdentityAnswer] = useState(null);

  useEffect(() => {
    if (!user) {
      setTodayLog(null);
      setLoading(false);
      return;
    }

    const today = getDateString();
    const logRef = doc(db, 'dailyLogs', `${user.uid}_${today}`);

    const unsubscribe = onSnapshot(logRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTodayLog(data);
        setIdentityAnswer(data.identityAnswer || null);
      } else {
        // Create initial log document if it doesn't exist
        const initialLog = {
          date: today,
          userId: user.uid,
          habits: {},
          identityAnswer: null,
          completed: false
        };
        try {
          await setDoc(logRef, initialLog);
          setTodayLog(initialLog);
        } catch (error) {
          console.error('Error creating initial log:', error);
          setTodayLog(initialLog); // Set in state anyway for UI
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateHabitStatus = async (habitId, status) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    if (!todayLog) {
      console.error('Today log not initialized yet');
      return;
    }

    try {
      const today = getDateString();
      const logRef = doc(db, 'dailyLogs', `${user.uid}_${today}`);
      
      const previousStatus = todayLog.habits?.[habitId];
      const habit = habits.find(h => h.id === habitId);
      
      if (!habit) {
        console.error('Habit not found:', habitId);
        return;
      }

      const updatedHabits = {
        ...(todayLog.habits || {}),
        [habitId]: status
      };

      const newLog = {
        ...todayLog,
        habits: updatedHabits,
        date: today,
        userId: user.uid
      };

      console.log('Saving habit status:', { habitId, status, newLog });
      await setDoc(logRef, newLog, { merge: true });
      console.log('Habit status saved successfully');

      // Calculate XP change
      let xpChange = 0;
      
      // Remove previous XP if status changed
      if (previousStatus === true) {
        xpChange -= habit.xp;
      } else if (previousStatus === false) {
        xpChange += habit.penalty; // Remove penalty
      }
      
      // Add new XP
      if (status === true) {
        xpChange += habit.xp;
      } else if (status === false) {
        xpChange -= habit.penalty;
      }

      console.log('XP change:', xpChange);

      // Update user XP
      if (xpChange !== 0) {
        console.log('Updating user XP...');
        await updateUserXP(user.uid, xpChange);
        console.log('User XP updated');
      }

      setTodayLog(newLog);
    } catch (error) {
      console.error('Error updating habit status:', error);
      alert('Error updating habit. Please check console for details.');
    }
  };

  const updateIdentityAnswer = async (answer) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    if (!todayLog) {
      console.error('Today log not initialized yet');
      return;
    }

    try {
      const today = getDateString();
      const logRef = doc(db, 'dailyLogs', `${user.uid}_${today}`);

      const previousAnswer = todayLog.identityAnswer;
      setIdentityAnswer(answer);
      
      const newLog = {
        ...todayLog,
        identityAnswer: answer,
        date: today,
        userId: user.uid
      };

      console.log('Saving identity answer:', { answer, newLog });
      await setDoc(logRef, newLog, { merge: true });
      console.log('Identity answer saved successfully');

      // Update identity score if changed
      if (previousAnswer !== answer) {
        let scoreChange = 0;
        
        // Remove previous answer's effect
        if (previousAnswer === true) {
          scoreChange -= 1; // Remove +1 from previous yes
        } else if (previousAnswer === false) {
          scoreChange += 1; // Remove -1 from previous no (add it back)
        }
        
        // Add new answer's effect
        if (answer === true) {
          scoreChange += 1; // Add +1 for yes
        } else if (answer === false) {
          scoreChange -= 1; // Add -1 for no
        }
        
        console.log('Identity score change:', scoreChange);
        
        if (scoreChange !== 0) {
          console.log('Updating identity score...');
          await updateIdentityScore(user.uid, scoreChange);
          console.log('Identity score updated');
        }
      }

      setTodayLog(newLog);
    } catch (error) {
      console.error('Error updating identity answer:', error);
      alert('Error updating identity answer. Please check console for details.');
    }
  };

  return {
    todayLog,
    loading,
    identityAnswer,
    updateHabitStatus,
    updateIdentityAnswer
  };
};
