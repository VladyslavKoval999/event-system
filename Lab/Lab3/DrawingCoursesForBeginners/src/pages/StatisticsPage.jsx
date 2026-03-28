import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnalyticsChart from '../components/AnalyticsChart';
import { importExternalParticipants } from '../api/mockApi';

const StatisticsPage = () => {
  const [extData, setExtData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      const users = await importExternalParticipants();
      setExtData(users);
    } catch (error) {
      console.error("Деталі помилки:", error); 
      alert("Помилка імпорту");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Link to="/" className="back-link">← Назад</Link>
      <header className="header">
        <h2 style={{ marginBottom: '10px' }}>Аналітика та імпорт</h2>
      </header>
      
      <AnalyticsChart />

      <div style={{ marginTop: '50px' }}>
        <h3>Імпорт із зовнішнього API</h3>
        <button onClick={handleImport} className="btn btn-primary" disabled={loading}>
          {loading ? "Завантаження..." : "Імпортувати користувачів"}
        </button>

        <div className="participants-grid" style={{ marginTop: '20px' }}>
          {extData.map(u => (
            <div key={u.id} className="participant-card">
              <h3>{u.name}</h3>
              <p>{u.email}</p>
              <span style={{ fontSize: '0.8rem', color: '#ff4d4d', fontWeight: 'bold' }}>
                External API
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;