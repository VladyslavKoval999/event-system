import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Імітація агрегованих даних: кількість реєстрацій за останні 7 днів 
const data = [
  { day: '12.02', count: 5 },
  { day: '13.02', count: 12 },
  { day: '14.02', count: 8 },
  { day: '15.02', count: 18 },
  { day: '16.02', count: 15 },
  { day: '17.02', count: 25 },
  { day: '18.02', count: 20 },
];

const AnalyticsChart = () => {
  return (
    <div className="analytics-section" style={{ width: '100%', height: 300, marginTop: '30px' }}>
      <h3>Графік активності реєстрацій</h3>
      {/* ResponsiveContainer забезпечує чуйність SVG-графіка [cite: 28] */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#ff4d4d" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;