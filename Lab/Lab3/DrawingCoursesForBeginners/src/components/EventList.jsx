import EventCard from './EventCard';

const EventList = ({ courses, favorites, toggleFavorite }) => {
  // Перевірка на порожній список
  if (courses.length === 0) {
    return <p className="no-results">Нічого не знайдено за вашим запитом :(</p>;
  }

  return (
    <main className="event-list">
      {courses.map(course => (
        <EventCard 
          key={course.id} 
          event={course} 
          isFavorite={favorites.includes(course.id)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </main>
  );
};

export default EventList;