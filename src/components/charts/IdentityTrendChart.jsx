import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const IdentityTrendChart = ({ dailyLogs }) => {
  // Get last 14 days of identity data
  const getLast14Days = () => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      days.push(dateStr);
    }
    return days;
  };

  const prepareData = () => {
    const days = getLast14Days();
    let cumulativeYes = 0;

    return days.map(date => {
      const log = dailyLogs[date];
      if (log?.identityAnswer === true) {
        cumulativeYes++;
      }

      const dayName = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        date: dayName,
        fullDate: date,
        identityScore: cumulativeYes,
        answered: log?.identityAnswer !== null && log?.identityAnswer !== undefined ? 1 : 0
      };
    });
  };

  const data = prepareData();

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No identity data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorIdentity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis
          dataKey="date"
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
          formatter={(value) => [value, 'Identity Score']}
        />
        <Area
          type="monotone"
          dataKey="identityScore"
          stroke="#10b981"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorIdentity)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
