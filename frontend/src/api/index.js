const API_URL = 'https://event-backend-api-u0ur.onrender.com';

export const fetchEvents = async (page = 1, limit = 6) => {
    const res = await fetch(`${API_URL}/events?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Помилка завантаження подій');
    return await res.json();
};

export const fetchParticipants = async (eventId) => {
    const res = await fetch(`${API_URL}/participants/${eventId}`);
    if (!res.ok) throw new Error('Помилка завантаження учасників');
    return await res.json();
};

export const registerParticipant = async (data) => {
    const res = await fetch(`${API_URL}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Помилка реєстрації');
    return await res.json();
};

export const loginUser = async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Невірний логін або пароль');
    return await res.json();
};

export const fetchExternalUsers = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    return await res.json();
};

export const fetchRegistrationStats = async () => {
    const stats = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        stats.push({
            date: date.toISOString().split('T')[0],
            registrations: Math.floor(Math.random() * 20) + 5
        });
    }
    return stats;
};

export const fetchEventsCursor = async (lastId = null, limit = 10) => {
    const url = lastId 
        ? `${API_URL}/events/cursor?lastId=${lastId}&limit=${limit}` 
        : `${API_URL}/events/cursor?limit=${limit}`;
        
    const res = await fetch(url);
    if (!res.ok) throw new Error('Помилка завантаження подій за курсором');
    return await res.json();
};