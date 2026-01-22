import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const WeeklyProgressChart = ({ dailyLogs, habits }) => {
  // Get last 7 days of data
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
      let completed = 0;
      let score = 0;
      const total = habits.length;

      if (log) {
        habits.forEach(habit => {
          const status = log.habits?.[habit.id];
          if (status === true) {
            completed++;
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
        completed,
        total,
        score,
        percentage: total > 0 ? (completed / total) * 100 : 0
      };
    });
  };

  const data = prepareData();

  if (data.length === 0 || habits.length === 0) {
    return (
      <div className="chart-empty">
        <p>No data available for the last 7 days</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          formatter={(value, name) => {
            if (name === 'percentage') return [`${value.toFixed(0)}%`, 'Completion'];
            if (name === 'score') return [value, 'Score'];
            return [value, name];
          }}
        />
        <Legend 
          wrapperStyle={{ color: '#a0a0a0', fontSize: '12px' }}
        />
        <Line 
          type="monotone" 
          dataKey="percentage" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Completion %"
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#8b5cf6" 
          strokeWidth={2}
          name="Daily Score"
          dot={{ fill: '#8b5cf6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
