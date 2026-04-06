import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import ParticipantsPage from './pages/ParticipantsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Chat from './components/Chat';
import Login from './components/Login';
import './App.css';

const App = () => {
  const theme = useSelector((state) => state.theme.mode);

  return (
    <div className={`app-theme-${theme}`}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register/:eventId" element={<RegistrationPage />} />
          <Route path="/participants/:eventId" element={<ParticipantsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/chat" element={<div className="app-container"><Chat /></div>} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div className="app-container"><h2 style={{textAlign: 'center'}}>404 - Сторінку не знайдено</h2></div>} />
        </Routes>
      </Router>
    </div>
  );
};
export default App;