import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EventList from '../components/EventList';
import { fetchEventsCursor } from '../api/index';

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [lastId, setLastId] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('favorite_events');
            return saved ? JSON.parse(saved) : [];
        } catch (err) {
            console.error("Помилка читання LocalStorage:", err);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('favorite_events', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        const fetchInitial = async () => {
            setLoading(true);
            try {
                const response = await fetchEventsCursor(null, 10); 
                if (response.data.length === 0) {
                    setHasMore(false);
                } else {
                    setEvents(response.data);
                    if (response.nextId) {
                        setLastId(response.nextId);
                    } else {
                        setHasMore(false);
                    }
                }
            } catch (err) {
                console.error("Помилка завантаження:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchInitial();
    }, []);

    useEffect(() => {
        const handleScroll = async () => {
            const scrolledToBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100;
            
            if (scrolledToBottom && !loading && hasMore && lastId) {
                setLoading(true);
                try {
                    const response = await fetchEventsCursor(lastId, 10);
                    
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        setEvents(prev => {
                            const existingIds = new Set(prev.map(e => e._id));
                            const newEvents = response.data.filter(e => !existingIds.has(e._id));
                            return [...prev, ...newEvents];
                        });
                        
                        if (response.nextId) {
                            setLastId(response.nextId);
                        } else {
                            setHasMore(false);
                        }
                    }
                } catch (err) {
                    console.error("Помилка підвантаження:", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, lastId]);

    const toggleFavorite = (id) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const filteredEvents = events.filter(ev => 
        ev.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="app-container">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <EventList 
                events={filteredEvents} 
                favorites={favorites} 
                toggleFavorite={toggleFavorite} 
            />
            {loading && <div className="loader" style={{textAlign: 'center', marginTop: '20px'}}>Завантаження подій...</div>}
            {!hasMore && events.length > 0 && <p style={{textAlign: 'center', marginTop: '20px', color: '#adb5bd'}}>✨ Всі події завантажено</p>}
        </div>
    );
};

export default HomePage;