import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { HabitCard } from '../components/HabitCard';

export const Habits = () => {
  const { habits, createHabit, updateHabit, deleteHabit } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    difficulty: 'medium',
    xp: 10,
    penalty: 5,
    reminderTime: '' // Format: HH:MM (e.g., "09:00")
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingHabit) {
      await updateHabit(editingHabit.id, formData);
      setEditingHabit(null);
    } else {
      await createHabit(formData);
    }
    setFormData({
      name: '',
      difficulty: 'medium',
      xp: 10,
      penalty: 5,
      reminderTime: ''
    });
    setShowForm(false);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      difficulty: habit.difficulty,
      xp: habit.xp,
      penalty: habit.penalty,
      reminderTime: habit.reminderTime || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(habitId);
    }
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', xp: 5, penalty: 2 },
    { value: 'medium', label: 'Medium', xp: 10, penalty: 5 },
    { value: 'hard', label: 'Hard', xp: 20, penalty: 10 },
    { value: 'extreme', label: 'Extreme', xp: 50, penalty: 25 }
  ];

  const handleDifficultyChange = (difficulty) => {
    const option = difficultyOptions.find(opt => opt.value === difficulty);
    setFormData({
      ...formData,
      difficulty,
      xp: option.xp,
      penalty: option.penalty
    });
  };

  return (
    <div className="habits-page">
      <div className="page-header">
        <h1>Habits</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingHabit(null);
            setFormData({
              name: '',
              difficulty: 'medium',
              xp: 10,
              penalty: 5,
              reminderTime: ''
            });
          }}
        >
          {showForm ? 'Cancel' : '+ New Habit'}
        </button>
      </div>

      {showForm && (
        <div className="habit-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Habit Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning workout"
                required
              />
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
              >
                {difficultyOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.xp} XP, -{opt.penalty} penalty)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>XP Value</label>
                <input
                  type="number"
                  value={formData.xp}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Penalty</label>
                <input
                  type="number"
                  value={formData.penalty}
                  onChange={(e) => setFormData({ ...formData, penalty: parseInt(e.target.value) || 0 })}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reminder Time (Optional)</label>
              <input
                type="time"
                value={formData.reminderTime}
                onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                placeholder="e.g., 09:00"
              />
              <small className="form-hint">
                Get a notification at this time to complete this habit
              </small>
            </div>

            <button type="submit" className="btn-primary">
              {editingHabit ? 'Update Habit' : 'Create Habit'}
            </button>
          </form>
        </div>
      )}

      <div className="habits-list">
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Create your first habit to start tracking.</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="habit-item">
              <HabitCard habit={habit} />
              <div className="habit-item-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(habit)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(habit.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
