import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const StreakBarChart = ({ habitStreaks }) => {
  const prepareData = () => {
    return habitStreaks
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 10) // Top 10 habits
      .map(habit => ({
        name: habit.name.length > 15 ? habit.name.substring(0, 15) + '...' : habit.name,
        fullName: habit.name,
        streak: habit.streak,
        comebackStreak: habit.comebackStreak || 0
      }));
  };

  const data = prepareData();

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No streak data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={80}
          stroke="#a0a0a0"
          style={{ fontSize: '11px' }}
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
            if (name === 'streak') return [value, 'Current Streak'];
            if (name === 'comebackStreak') return [value, 'Comeback Streak'];
            return [value, name];
          }}
          labelFormatter={(label) => `Habit: ${label}`}
        />
        <Legend 
          wrapperStyle={{ color: '#a0a0a0', fontSize: '12px' }}
        />
        <Bar 
          dataKey="streak" 
          fill="#f59e0b" 
          name="Current Streak"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="comebackStreak" 
          fill="#8b5cf6" 
          name="Comeback Streak"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
