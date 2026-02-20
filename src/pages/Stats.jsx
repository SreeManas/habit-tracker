import { useStats } from '../hooks/useStats';
import { useAuth } from '../hooks/useAuth';
import { HabitCard } from '../components/HabitCard';
import { NotificationSettings } from '../components/NotificationSettings';
import { ResetButton } from '../components/ResetButton';
import { WeeklyProgressChart } from '../components/charts/WeeklyProgressChart';
import { HabitCompletionChart } from '../components/charts/HabitCompletionChart';
import { StreakBarChart } from '../components/charts/StreakBarChart';
import { IdentityTrendChart } from '../components/charts/IdentityTrendChart';
import { DailyScoreChart } from '../components/charts/DailyScoreChart';
import { ContributionHeatMap } from '../components/charts/ContributionHeatMap';

export const Stats = () => {
  const { user, userData } = useAuth();
  const { 
    getTodayStats, 
    getWeeklyStats, 
    getHabitStreaks, 
    getLevelInfo,
    dailyLogs,
    habits
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

      <div className="charts-section">
        <h2>Visual Analytics</h2>
        
        <div className="chart-card full-width">
          <ContributionHeatMap dailyLogs={dailyLogs} habits={habits} />
        </div>
        
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Weekly Progress</h3>
            <p className="chart-description">Completion % and Daily Score over the last 7 days</p>
            <WeeklyProgressChart dailyLogs={dailyLogs} habits={habits} />
          </div>

          <div className="chart-card">
            <h3>Today's Habit Status</h3>
            <p className="chart-description">Distribution of completed, missed, and pending habits</p>
            <HabitCompletionChart habits={habits} dailyLogs={dailyLogs} />
          </div>

          <div className="chart-card">
            <h3>Daily Scores</h3>
            <p className="chart-description">Your daily scores for the last 7 days</p>
            <DailyScoreChart dailyLogs={dailyLogs} habits={habits} />
          </div>

          <div className="chart-card">
            <h3>Identity Score Trend</h3>
            <p className="chart-description">Cumulative identity score over the last 14 days</p>
            <IdentityTrendChart dailyLogs={dailyLogs} />
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
          <>
            <div className="chart-card">
              <h3>Top Streaks</h3>
              <p className="chart-description">Current and comeback streaks for your habits</p>
              <StreakBarChart habitStreaks={habitStreaks} />
            </div>
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
          </>
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
