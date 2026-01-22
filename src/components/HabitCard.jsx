export const HabitCard = ({ habit, status, onToggle, showStreak = false, streak = 0 }) => {
  const getStatusClass = () => {
    if (!onToggle) return ''; // No status class if no toggle functionality
    if (status === true) return 'done';
    if (status === false) return 'missed';
    return 'pending';
  };

  const getDifficultyColor = () => {
    const colors = {
      easy: '#4ade80',
      medium: '#fbbf24',
      hard: '#f87171',
      extreme: '#dc2626'
    };
    return colors[habit.difficulty] || colors.medium;
  };

  return (
    <div className={`habit-card ${getStatusClass()}`}>
      <div className="habit-header">
        <div className="habit-info">
          <h3 className="habit-name">{habit.name}</h3>
          <div className="habit-meta">
            <span 
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor() }}
            >
              {habit.difficulty}
            </span>
            <span className="xp-badge">+{habit.xp} XP</span>
            {habit.penalty > 0 && (
              <span className="penalty-badge">-{habit.penalty} penalty</span>
            )}
            {showStreak && streak > 0 && (
              <span className="streak-badge">🔥 {streak}</span>
            )}
            {habit.reminderTime && (
              <span className="reminder-badge">🔔 {habit.reminderTime}</span>
            )}
          </div>
        </div>
      </div>
      
      {onToggle && (
        <div className="habit-actions">
          <button
            className={`btn-status ${status === true ? 'active' : ''}`}
            onClick={() => onToggle(habit.id, true)}
          >
            ✓ Done
          </button>
          <button
            className={`btn-status ${status === false ? 'active' : ''}`}
            onClick={() => onToggle(habit.id, false)}
          >
            ✗ Missed
          </button>
          <button
            className={`btn-status ${status === null || status === undefined ? 'active' : ''}`}
            onClick={() => onToggle(habit.id, null)}
          >
            ○ Pending
          </button>
        </div>
      )}
    </div>
  );
};
