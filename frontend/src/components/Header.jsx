import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';

const Header = ({ searchTerm, setSearchTerm }) => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.theme.mode);

    return (
        <header className="header">
            <div className="header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Event Management</h1>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Link to="/analytics" className="btn btn-outline" style={{ padding: '8px 15px', textDecoration: 'none' }}>📊 Аналітика</Link>
                    <Link to="/chat" className="btn btn-outline" style={{ padding: '8px 15px', textDecoration: 'none' }}>💬 Чат</Link>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '8px 15px', textDecoration: 'none' }}>Увійти</Link>
                    <button onClick={() => dispatch(toggleTheme())} className="theme-toggle-btn">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
            <input type="text" placeholder="Пошук події..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </header>
    );
};
export default Header;