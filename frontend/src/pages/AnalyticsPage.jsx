import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRegistrationStats } from '../api/index';
import AnalyticsChart from '../components/AnalyticsChart';
import ExternalImport from '../components/ExternalImport';

const AnalyticsPage = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrationStats().then(data => {
            setStats(data);
            setLoading(false);
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="app-container">
            <Link to="/" className="back-link">← Назад</Link>
            <header className="header">
                <h1>Панель аналітики</h1>
            </header>
            {loading ? <div className="loader" style={{textAlign: 'center'}}>Завантаження...</div> : (
                <>
                    <div className="chart-container" style={{ background: 'white', padding: '20px', borderRadius: '18px', boxShadow: '0 6px 15px rgba(0,0,0,0.05)' }}>
                        <AnalyticsChart data={stats} />
                    </div>
                    <ExternalImport />
                </>
            )}
        </div>
    );
};
export default AnalyticsPage;