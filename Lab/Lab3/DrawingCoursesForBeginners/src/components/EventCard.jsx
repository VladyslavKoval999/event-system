import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, isFavorite, toggleFavorite }) => {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p className="description">{event.description}</p>
      <div className="info">
        <span>📅 {event.date}</span>
        <span>🎨 {event.organizer}</span>
      </div>
      
      <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <Link to={`/register/${event.id}`} className="btn btn-primary">Зареєструватися</Link>
        <Link to={`/participants/${event.id}`} className="btn btn-outline">Учасники</Link>
      </div>

      <button 
        onClick={() => toggleFavorite(event.id)}
        className={`fav-btn ${isFavorite ? 'active' : ''}`}
        style={{ marginTop: '15px' }}
      >
        {isFavorite ? '❤️ У вибраному' : '🤍 Додати у вибране'}
      </button>
    </div>
  );
};

export default EventCard;