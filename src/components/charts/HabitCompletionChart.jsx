import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const HabitCompletionChart = ({ habits, dailyLogs }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs[today];

  const prepareData = () => {
    if (!todayLog || habits.length === 0) return [];

    let completed = 0;
    let missed = 0;
    let pending = 0;

    habits.forEach(habit => {
      const status = todayLog.habits?.[habit.id];
      if (status === true) completed++;
      else if (status === false) missed++;
      else pending++;
    });

    return [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Missed', value: missed, color: '#ef4444' },
      { name: 'Pending', value: pending, color: '#6b7280' }
    ].filter(item => item.value > 0);
  };

  const data = prepareData();

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No habit data for today</p>
      </div>
    );
  }

  const COLORS = {
    'Completed': '#10b981',
    'Missed': '#ef4444',
    'Pending': '#6b7280'
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #2a2a2a',
            borderRadius: '6px',
            color: '#e0e0e0'
          }}
        />
        <Legend 
          wrapperStyle={{ color: '#a0a0a0', fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
