import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, selectTheme } from '../redux/slices/themeSlice';

const Header = ({ searchTerm, setSearchTerm }) => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  return (
    <header className="header">
      <div className="header-top">
        <h1>Творчі інтенсиви</h1>
        
        <button 
          onClick={() => dispatch(toggleTheme())} 
          className="theme-toggle-btn"
          title={theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <input
        type="text"
        placeholder="Пошук курсу за назвою..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </header>
  );
};

export default Header;