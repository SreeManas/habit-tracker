import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DailyScoreChart = ({ dailyLogs, habits }) => {
  // Get last 7 days
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push(dateStr);
    }
    return days;
  };

  const prepareData = () => {
    const days = getLast7Days();
    return days.map(date => {
      const log = dailyLogs[date];
      let score = 0;

      if (log) {
        habits.forEach(habit => {
          const status = log.habits?.[habit.id];
          if (status === true) {
            score += habit.xp;
          } else if (status === false) {
            score -= habit.penalty;
          }
        });
      }

      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        date: dayName,
        fullDate: date,
        score: Math.max(0, score) // Ensure non-negative for display
      };
    });
  };

  const data = prepareData();

  if (data.length === 0 || habits.length === 0) {
    return (
      <div className="chart-empty">
        <p>No score data available</p>
      </div>
    );
  }

  // Determine color based on score
  const getColor = (score) => {
    if (score >= 50) return '#10b981'; // Green for high scores
    if (score >= 20) return '#3b82f6'; // Blue for medium scores
    if (score >= 0) return '#f59e0b'; // Orange for low scores
    return '#ef4444'; // Red for negative
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis 
          dataKey="date" 
          stroke="#a0a0a0"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#a0a0a0"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #2a2a2a',
            borderRadius: '6px',
            color: '#e0e0e0'
          }}
          formatter={(value) => [value, 'Daily Score']}
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#3b82f6">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
