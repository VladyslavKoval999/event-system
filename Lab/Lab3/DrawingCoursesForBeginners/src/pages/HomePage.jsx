import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import EventList from '../components/EventList';
import { fetchCourses, toggleFavorite } from '../redux/slices/eventsSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const { items: courses, favorites, status } = useSelector((state) => state.events);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses());
    }
  }, [status, dispatch]);

  const handleToggleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {status === 'loading' ? (
        <div className="loader">Завантаження курсів...</div>
      ) : (
        <EventList 
          courses={filteredCourses} 
          favorites={favorites} 
          toggleFavorite={handleToggleFavorite} 
        />
      )}
    </div>
  );
};

export default HomePage;