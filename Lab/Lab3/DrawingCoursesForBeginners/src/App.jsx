import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectTheme } from './redux/slices/themeSlice';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import ParticipantsPage from './pages/ParticipantsPage';
import ErrorToast from './components/ErrorToast';
import './App.css';

const App = () => {
  const theme = useSelector(selectTheme);

  return (
    <div className={`app-theme-${theme}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register/:eventId" element={<RegistrationPage />} />
          <Route path="/participants/:eventId" element={<ParticipantsPage />} />
          <Route path="*" element={<div className="app-container"><h2>404 - Сторінку не знайдено</h2></div>} />
        </Routes>
        <ErrorToast />
      </BrowserRouter>
    </div>
  );
};

export default App;