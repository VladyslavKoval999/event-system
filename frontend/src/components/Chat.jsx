import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); 

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('chatMessage', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => socket.off('chatMessage');
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            socket.emit('chatMessage', input);
            setInput('');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', maxWidth: '400px', borderRadius: '8px' }}>
            <h3>Чат підтримки (Real-time)</h3>
            <div style={{ height: '200px', overflowY: 'auto', border: '1px solid #eee', marginBottom: '10px', padding: '5px' }}>
                {messages.length === 0 ? <p style={{color: 'gray'}}>Повідомлень ще немає...</p> : null}
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {messages.map((m, i) => (
                        <li key={i} style={{ background: '#f0f0f0', margin: '5px 0', padding: '8px', borderRadius: '4px' }}>
                            {m}
                        </li>
                    ))}
                </ul>
            </div>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text"
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Ваше повідомлення..."
                    style={{ flexGrow: 1, padding: '8px' }}
                />
                <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Надіслати</button>
            </form>
        </div>
    );
}