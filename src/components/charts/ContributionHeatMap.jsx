import { useMemo } from 'react';

export const ContributionHeatMap = ({ dailyLogs, habits }) => {
  // Memoize contribution data to avoid recalculating on every render
  const contributionData = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const data = [];

    if (!dailyLogs || typeof dailyLogs !== 'object') return [];
    if (!Array.isArray(habits)) return [];

    // Generate all days from one year ago to today
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const log = dailyLogs[dateStr];

      let score = 0;
      let completed = 0;
      let total = habits.length;

      if (log && habits.length > 0) {
        habits.forEach(habit => {
          if (!habit || !habit.id) return;

          const status = log.habits?.[habit.id];
          if (status === true) {
            score += habit.xp || 0;
            completed++;
          } else if (status === false) {
            score -= habit.penalty || 0;
          }
        });
      }

      data.push({
        date: dateStr,
        score,
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0,
        hasData: log !== undefined,
        hasAnyActivity: completed > 0 || (log && Object.keys(log.habits || {}).length > 0)
      });
    }

    return data;
  }, [dailyLogs, habits]);

  // Derive month labels from memoized data
  const monthLabels = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];

    if (contributionData.length === 0) return labels;

    const firstDate = new Date(contributionData[0].date);
    const lastDate = new Date(contributionData[contributionData.length - 1].date);

    for (let m = 0; m < 12; m++) {
      const monthDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + m, 1);
      if (monthDate <= lastDate) {
        labels.push({
          month: months[monthDate.getMonth()],
          position: (monthDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
        });
      }
    }

    return labels;
  }, [contributionData]);

  const totalContributions = useMemo(() => {
    return contributionData.filter(d => d.hasAnyActivity).length;
  }, [contributionData]);

  const getIntensityLevel = (percentage, hasData, hasAnyActivity) => {
    if (!hasData) return 0;
    if (!hasAnyActivity || percentage === 0) return 1;
    if (percentage < 20) return 2;
    if (percentage < 40) return 3;
    if (percentage < 60) return 4;
    if (percentage < 80) return 5;
    return 6;
  };

  const getCellColor = (intensity) => {
    const colors = [
      '#161b22', // 0 - no data
      '#30363d', // 1 - no activity
      '#0e4429', // 2 - very low activity
      '#006d32', // 3 - low activity
      '#26a641', // 4 - medium activity
      '#39d353', // 5 - high activity
      '#40c463'  // 6 - very high activity
    ];
    return colors[intensity] || colors[0];
  };

  const weekdayLabels = ['Mon', '', 'Wed', '', 'Fri', '', ''];

  // Group data by weeks
  const weeks = useMemo(() => {
    const result = [];
    let currentWeek = [];

    contributionData.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();
      const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      if (adjustedDayOfWeek === 0 && currentWeek.length > 0) {
        result.push(currentWeek);
        currentWeek = [];
      }

      // Fill empty days for week start
      while (currentWeek.length < adjustedDayOfWeek) {
        currentWeek.push(null);
      }

      currentWeek.push(day);

      // If this is the last day, push the week
      if (index === contributionData.length - 1) {
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        result.push(currentWeek);
      }
    });

    return result;
  }, [contributionData]);

  return (
    <div className="contribution-heatmap">
      <div className="heatmap-header">
        <h3>Contribution Activity</h3>
        <div className="total-contributions">
          {totalContributions} contributions in the last year
        </div>
      </div>

      <div className="heatmap-container">
        <div className="month-labels">
          {monthLabels.map((label, index) => (
            <div
              key={index}
              className="month-label"
              style={{ left: `${label.position * 15}px` }}
            >
              {label.month}
            </div>
          ))}
        </div>

        <div className="heatmap-grid">
          <div className="weekday-labels">
            {weekdayLabels.map((label, index) => (
              <div key={index} className="weekday-label">
                {label}
              </div>
            ))}
          </div>

          <div className="days-grid">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="week">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <div
                        key={dayIndex}
                        className="day-cell empty"
                      />
                    );
                  }

                  const intensity = getIntensityLevel(day.percentage, day.hasData, day.hasAnyActivity);
                  const date = new Date(day.date);
                  const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  const tooltipText = day.hasData
                    ? `${formattedDate}: ${day.completed}/${day.total} habits completed (${day.percentage.toFixed(0)}%)`
                    : `${formattedDate}: No data`;

                  return (
                    <div
                      key={dayIndex}
                      className="day-cell"
                      style={{ backgroundColor: getCellColor(intensity) }}
                      title={tooltipText}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        <div className="legend-colors">
          {[0, 1, 2, 3, 4, 5, 6].map(level => (
            <div
              key={level}
              className="legend-color"
              style={{ backgroundColor: getCellColor(level) }}
            />
          ))}
        </div>
        <span className="legend-label">More</span>
      </div>
    </div>
  );
};
