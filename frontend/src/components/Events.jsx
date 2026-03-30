import { useState, useEffect } from 'react';

const API_URL = 'https://event-backend-api-u0ur.onrender.com';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/events`)
            .then(res => res.json())
            .then(data => {
                if(data && data.data) {
                    setEvents(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Помилка завантаження подій:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Усі події (Event Management)</h2>
            <p>Список подій, що завантажується з бази даних MongoDB через REST API.</p>
            
            {loading ? <p>Завантаження подій...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {events.length === 0 ? <p>Подій поки немає.</p> : events.map(ev => (
                        <div key={ev._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{ev.title}</h3>
                            <p style={{ margin: '0 0 10px 0' }}>{ev.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7f8c8d', fontSize: '0.9em' }}>
                                <span><strong>Дата:</strong> {new Date(ev.date).toLocaleDateString()}</span>
                                <span><strong>Організатор:</strong> {ev.organizer || "Не вказано"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}