// Game logic utilities

// Calculate level from total XP
export const calculateLevel = (totalXP) => {
  // Level formula: level = floor(sqrt(totalXP / 100))
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

// Calculate XP required for next level
export const getXPForNextLevel = (currentLevel) => {
  return Math.pow(currentLevel, 2) * 100;
};

// Calculate XP progress for current level
export const getXPProgress = (totalXP, currentLevel) => {
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNext,
    percentage: (xpInCurrentLevel / xpNeededForNext) * 100
  };
};

// Calculate daily score
export const calculateDailyScore = (habits, dailyLog) => {
  let score = 0;
  let completed = 0;
  let total = habits.length;

  habits.forEach(habit => {
    const log = dailyLog[habit.id];
    if (log === true) {
      score += habit.xp;
      completed++;
    } else if (log === false) {
      score -= habit.penalty;
    }
  });

  return {
    score,
    completed,
    total,
    percentage: total > 0 ? (completed / total) * 100 : 0
  };
};

// Calculate streak
export const calculateStreak = (habitId, dailyLogs) => {
  let streak = 0;
  const sortedLogs = Object.entries(dailyLogs)
    .filter(([, log]) => log.habits && log.habits[habitId] === true)
    .sort(([a], [b]) => new Date(b) - new Date(a));

  for (const [dateStr] of sortedLogs) {
    const logDate = new Date(dateStr);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - streak);
    expectedDate.setHours(0, 0, 0, 0);
    logDate.setHours(0, 0, 0, 0);

    if (streak === 0 || logDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Calculate comeback streak (consecutive successes after the most recent failure)
export const calculateComebackStreak = (habitId, dailyLogs) => {
  let comebackStreak = 0;
  let foundFailure = false;
  const sortedLogs = Object.entries(dailyLogs)
    .sort(([a], [b]) => new Date(b) - new Date(a));

  for (const [, log] of sortedLogs) {
    const status = log.habits?.[habitId];
    if (status === false) {
      foundFailure = true;
      break; // Stop counting once we hit the failure
    } else if (status === true) {
      comebackStreak++;
    }
  }

  // Only return a comeback streak if there was a failure before the successes
  return foundFailure ? comebackStreak : 0;
};

// Get date string in YYYY-MM-DD format (using local time, not UTC)
export const getDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get week start date (Monday)
export const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

// Get week range string
export const getWeekRange = (date = new Date()) => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return {
    start: getDateString(start),
    end: getDateString(end)
  };
};
