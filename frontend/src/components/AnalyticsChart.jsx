import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsChart = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Динаміка реєстрацій за тиждень</h3>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="registrations" fill="#ff4d4d" name="Кількість реєстрацій" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default AnalyticsChart;