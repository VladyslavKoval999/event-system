import React from 'react';
import EventCard from './EventCard';

const EventList = ({ events, favorites, toggleFavorite }) => {
    if (!events || events.length === 0) {
        return (
            <p className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#adb5bd' }}>
                Нічого не знайдено за вашим запитом :(
            </p>
        );
    }

    return (
        <div className="event-list">
            {events.map(ev => (
                <EventCard
                    key={ev._id}
                    event={ev}
                    isFavorite={favorites.includes(ev._id)}
                    toggleFavorite={toggleFavorite}
                />
            ))}
        </div>
    );
};

export default EventList;