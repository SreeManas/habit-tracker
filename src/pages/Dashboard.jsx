import { useHabits } from '../hooks/useHabits';
import { useDailyRun } from '../hooks/useDailyRun';
import { useStats } from '../hooks/useStats';
import { HabitCard } from '../components/HabitCard';
import { IdentityQuestion } from '../components/IdentityQuestion';


export const Dashboard = () => {
  const { habits, loading: habitsLoading } = useHabits();
  const { todayLog, updateHabitStatus, updateIdentityAnswer, identityAnswer } = useDailyRun();
  const { getTodayStats, getLevelInfo } = useStats();
  const levelInfo = getLevelInfo();
  const todayStats = getTodayStats();

  const handleHabitToggle = (habitId, status) => {
    updateHabitStatus(habitId, status);
  };

  if (habitsLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Today's Run</h1>
        <div className="daily-score">
          <div className="score-display">
            <span className="score-label">Daily Score</span>
            <span className="score-value">
              {todayStats ? todayStats.score : 0}
            </span>
          </div>
          <div className="completion-display">
            {todayStats && (
              <>
                <span>{todayStats.completed}/{todayStats.total}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${todayStats.percentage}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="level-display">
        <div className="level-info">
          <span className="level-text">Level {levelInfo.level}</span>
          <div className="xp-bar-container">
            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{ width: `${levelInfo.percentage}%` }}
              ></div>
            </div>
            <span className="xp-text">
              {levelInfo.current} / {levelInfo.needed} XP
            </span>
          </div>
        </div>
      </div>

      <div className="habits-section">
        <h2>Habits</h2>
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Create your first habit to get started.</p>
          </div>
        ) : (
          <div className="habits-grid">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                status={todayLog?.habits?.[habit.id]}
                onToggle={handleHabitToggle}
              />
            ))}
          </div>
        )}
      </div>

      <div className="identity-section">
        <IdentityQuestion
          answer={identityAnswer}
          onAnswer={updateIdentityAnswer}
        />
      </div>
    </div>
  );
};
