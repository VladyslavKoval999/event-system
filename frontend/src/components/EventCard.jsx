import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, isFavorite, toggleFavorite }) => (
    <div className="event-card">
        <h3>{event.title}</h3>
        <p className="description">{event.description}</p>
        <div className="info">
            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
            <span>👤 {event.organizer || "Не вказано"}</span>
        </div>
        <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <Link to={`/register/${event._id}`} className="btn btn-primary">Зареєструватися</Link>
            <Link to={`/participants/${event._id}`} className="btn btn-outline">Учасники</Link>
        </div>
        <button onClick={() => toggleFavorite(event._id)} className={`fav-btn ${isFavorite ? 'active' : ''}`} style={{ marginTop: '15px' }}>
            {isFavorite ? '❤️ У вибраному' : '🤍 Додати у вибране'}
        </button>
    </div>
);
export default EventCard;