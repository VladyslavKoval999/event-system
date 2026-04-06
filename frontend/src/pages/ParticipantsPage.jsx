import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchParticipants } from '../api/index';

const ParticipantsPage = () => {
    const { eventId } = useParams();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchParticipants(eventId).then(data => {
            setParticipants(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [eventId]);

    return (
        <div className="app-container">
            <Link to="/" className="back-link">← Назад на головну</Link>
            <header className="header"><h2 style={{textAlign: 'center'}}>Список учасників</h2></header>
            
            {loading ? <div className="loader" style={{textAlign: 'center'}}>Завантаження...</div> : (
                <div className="participants-grid">
                    {participants.length === 0 ? <p style={{textAlign: 'center'}}>Ще немає учасників.</p> : participants.map((p) => (
                        <div key={p._id} className="participant-card">
                            <h3>{p.user?.email || 'Прихований Email'}</h3>
                            <p>Зареєстровано: {new Date(p.registeredAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ParticipantsPage;