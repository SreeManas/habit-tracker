import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const q = query(
      collection(db, 'habits'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHabits(habitsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createHabit = async (habitData) => {
    if (!user) return;

    const newHabit = {
      ...habitData,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    await addDoc(collection(db, 'habits'), newHabit);
  };

  const updateHabit = async (habitId, updates) => {
    await updateDoc(doc(db, 'habits', habitId), updates);
  };

  const deleteHabit = async (habitId) => {
    await deleteDoc(doc(db, 'habits', habitId));
  };

  return {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit
  };
};
