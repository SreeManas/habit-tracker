import { useStats } from '../hooks/useStats';
import { useAuth } from '../hooks/useAuth';
import { HabitCard } from '../components/HabitCard';
import { NotificationSettings } from '../components/NotificationSettings';
import { ResetButton } from '../components/ResetButton';

export const Stats = () => {
  const { user, userData } = useAuth();
  const { 
    getTodayStats, 
    getWeeklyStats, 
    getHabitStreaks, 
    getLevelInfo 
  } = useStats();
  
  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const habitStreaks = getHabitStreaks();
  const levelInfo = getLevelInfo();

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>Stats & Profile</h1>
        {user && (
          <div className="user-info">
            <img 
              src={user.photoURL || '/default-avatar.png'} 
              alt={user.displayName}
              className="user-avatar"
            />
            <span className="user-name">{user.displayName}</span>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Level & XP</h3>
          <div className="stat-content">
            <div className="level-display-large">
              <span className="level-number">Level {levelInfo.level}</span>
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
              <p className="total-xp">Total XP: {levelInfo.totalXP}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Identity Score</h3>
          <div className="stat-content">
            <div className="identity-score-display">
              <span className="score-large">{userData?.identityScore || 0}</span>
              <p>Days you acted like the man you want to become</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Today's Performance</h3>
          <div className="stat-content">
            {todayStats ? (
              <>
                <div className="stat-value">{todayStats.score}</div>
                <div className="stat-label">Daily Score</div>
                <div className="completion-stats">
                  <span>{todayStats.completed}/{todayStats.total} habits completed</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${todayStats.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="identity-status">
                  {todayStats.identityAnswer === true && (
                    <span className="identity-yes">✓ Identity affirmed</span>
                  )}
                  {todayStats.identityAnswer === false && (
                    <span className="identity-no">✗ Identity not met</span>
                  )}
                  {todayStats.identityAnswer === null && (
                    <span className="identity-pending">○ Not answered</span>
                  )}
                </div>
              </>
            ) : (
              <p>No data for today yet.</p>
            )}
          </div>
        </div>

        <div className="stat-card">
          <h3>Weekly Summary</h3>
          <div className="stat-content">
            <div className="stat-value">{weeklyStats.totalScore}</div>
            <div className="stat-label">Weekly Score</div>
            <div className="weekly-details">
              <p>{weeklyStats.totalCompleted}/{weeklyStats.totalHabits} habits completed</p>
              <p>{weeklyStats.daysCompleted} days logged</p>
              <p>Identity: {weeklyStats.identityPercentage.toFixed(0)}% yes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="streaks-section">
        <h2>Habit Streaks</h2>
        {habitStreaks.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Create habits to start tracking streaks.</p>
          </div>
        ) : (
          <div className="streaks-grid">
            {habitStreaks.map(habit => (
              <div key={habit.id} className="streak-card">
                <h3>{habit.name}</h3>
                <div className="streak-info">
                  <div className="streak-item">
                    <span className="streak-label">Current Streak</span>
                    <span className="streak-value">🔥 {habit.streak}</span>
                  </div>
                  {habit.comebackStreak > 0 && (
                    <div className="streak-item">
                      <span className="streak-label">Comeback Streak</span>
                      <span className="streak-value comeback">⚡ {habit.comebackStreak}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="notification-settings-section">
        <NotificationSettings />
      </div>

      <div className="reset-section-container">
        <ResetButton />
      </div>
    </div>
  );
};
