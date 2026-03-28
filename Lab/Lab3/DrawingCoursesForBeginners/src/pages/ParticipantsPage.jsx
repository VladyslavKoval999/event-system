import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParticipants, clearParticipants, setFilterTerm, selectFilteredParticipants } from '../redux/slices/participantsSlice';
import { fetchCourseById } from '../api/mockApi';

const ParticipantsPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const pageRef = useRef(1);
  const [course, setCourse] = useState(null);
  
  const participants = useSelector(selectFilteredParticipants);
  const { status, hasMore, filterTerm } = useSelector((state) => state.participants);
  const isLoading = status === 'loading';

  useEffect(() => {
    fetchCourseById(eventId).then(data => {
      setCourse(data);
      if (data) document.title = `Учасники: ${data.title}`;
    });
  }, [eventId]);

  useEffect(() => {
    dispatch(clearParticipants());
    pageRef.current = 1;
    dispatch(fetchParticipants({ eventId, page: 1 }));
  }, [eventId, dispatch]);

  const handleLoadMore = () => {
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    dispatch(fetchParticipants({ eventId, page: nextPage }));
  };

  return (
    <div className="app-container">
      <Link to="/" className="back-link">← Назад на головну</Link>
      
      <header className="header">
        <h2 style={{ marginBottom: '10px' }}>Список учасників</h2>
        {course && (
          <p style={{ color: '#6c757d', fontStyle: 'italic', marginBottom: '20px' }}>
            Творчий інтенсив: «{course.title}»
          </p>
        )}
        
        <input 
          type="text" 
          placeholder="Пошук учасника..." 
          className="search-input"
          value={filterTerm}
          onChange={(e) => dispatch(setFilterTerm(e.target.value))}
          style={{ maxWidth: '100%' }}
        />
      </header>

      <div className="participants-grid">
        {participants.map((participant) => (
          <div key={participant.id} className="participant-card">
            <h3>{participant.name}</h3>
            <p>{participant.email}</p>
          </div>
        ))}
      </div>

      {isLoading && <div className="loader">Завантаження...</div>}
      
      {!isLoading && hasMore && participants.length > 0 && !filterTerm && (
        <button 
          className="btn btn-outline" 
          style={{ margin: '40px auto', display: 'block' }}
          onClick={handleLoadMore}
        >
          Завантажити ще
        </button>
      )}

      {!isLoading && participants.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#adb5bd' }}>
          Учасників не знайдено.
        </p>
      )}
    </div>
  );
};

export default ParticipantsPage;