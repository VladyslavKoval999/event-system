import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const socket = io('https://event-backend-api-u0ur.onrender.com');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const messageHandler = (msg) => setMessages(prev => [...prev, msg]);
        socket.on('chatMessage', messageHandler);
        return () => socket.off('chatMessage', messageHandler);
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            socket.emit('chatMessage', input);
            setInput('');
        }
    };

    return (
        <div>
            <Link to="/" className="back-link">← Назад</Link>
            <div className="form-container chat-container" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                <h3>Чат підтримки (Real-time)</h3>
                <div className="chat-box" style={{ height: '300px', overflowY: 'auto', border: '1px solid #eee', marginBottom: '10px', padding: '10px', borderRadius: '8px' }}>
                    {messages.length === 0 ? <p style={{color: 'gray'}}>Повідомлень ще немає...</p> : null}
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {messages.map((m, i) => <li key={i} className="chat-msg" style={{ background: '#f0f0f0', margin: '5px 0', padding: '8px', borderRadius: '4px' }}>{m}</li>)}
                    </ul>
                </div>
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ваше повідомлення..." className="search-input" style={{ padding: '8px', margin: 0 }} />
                    <button type="submit" className="btn btn-primary">Надіслати</button>
                </form>
            </div>
        </div>
    );
};
export default Chat;