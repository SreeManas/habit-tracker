import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';
import {
  calculateLevel,
  getXPProgress,
  calculateStreak,
  calculateComebackStreak,
  getWeekRange,
  getDateString
} from '../utils/gameLogic';

export const useStats = () => {
  const { user, userData } = useAuth();
  const [dailyLogs, setDailyLogs] = useState({});
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDailyLogs({});
      setHabits([]);
      setLoading(false);
      return;
    }

    // Load daily logs
    const logsQuery = query(
      collection(db, 'dailyLogs'),
      where('userId', '==', user.uid)
    );

    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const logs = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        logs[data.date] = data;
      });
      setDailyLogs(logs);
    });

    // Load habits
    const habitsQuery = query(
      collection(db, 'habits'),
      where('userId', '==', user.uid)
    );

    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHabits(habitsData);
      setLoading(false);
    });

    return () => {
      unsubscribeLogs();
      unsubscribeHabits();
    };
  }, [user]);

  const getTodayStats = () => {
    const today = getDateString();
    const todayLog = dailyLogs[today];
    if (!todayLog) return null;

    let score = 0;
    let completed = 0;
    let total = habits.length;

    habits.forEach(habit => {
      const status = todayLog.habits?.[habit.id];
      if (status === true) {
        score += habit.xp;
        completed++;
      } else if (status === false) {
        score -= habit.penalty;
      }
    });

    return {
      score,
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
      identityAnswer: todayLog.identityAnswer
    };
  };

  const getWeeklyStats = () => {
    const weekRange = getWeekRange();
    const weekLogs = Object.entries(dailyLogs)
      .filter(([date]) => date >= weekRange.start && date <= weekRange.end);

    let totalScore = 0;
    let totalCompleted = 0;
    let totalHabits = 0;
    let daysWithIdentity = 0;
    let identityYes = 0;

    weekLogs.forEach(([, log]) => {
      habits.forEach(habit => {
        totalHabits++;
        const status = log.habits?.[habit.id];
        if (status === true) {
          totalScore += habit.xp;
          totalCompleted++;
        } else if (status === false) {
          totalScore -= habit.penalty;
        }
      });

      if (log.identityAnswer !== null && log.identityAnswer !== undefined) {
        daysWithIdentity++;
        if (log.identityAnswer === true) {
          identityYes++;
        }
      }
    });

    return {
      totalScore,
      totalCompleted,
      totalHabits,
      daysCompleted: weekLogs.length,
      identityPercentage: daysWithIdentity > 0 ? (identityYes / daysWithIdentity) * 100 : 0
    };
  };

  const getHabitStreaks = () => {
    return habits.map(habit => ({
      ...habit,
      streak: calculateStreak(habit.id, dailyLogs),
      comebackStreak: calculateComebackStreak(habit.id, dailyLogs)
    })).sort((a, b) => b.streak - a.streak);
  };

  const getLevelInfo = () => {
    const totalXP = userData?.totalXP || 0;
    const level = calculateLevel(totalXP);
    const progress = getXPProgress(totalXP, level);
    return {
      level,
      totalXP,
      ...progress
    };
  };

  return {
    dailyLogs,
    habits,
    loading,
    getTodayStats,
    getWeeklyStats,
    getHabitStreaks,
    getLevelInfo,
    identityScore: userData?.identityScore || 0,
    userData
  };
};
