import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './components/Chat';
import Analytics from './components/Analytics';
import Events from './components/Events';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <nav style={{ marginBottom: '30px', display: 'flex', gap: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#2980b9', fontWeight: 'bold' }}>Список Подій</Link>
          <Link to="/chat" style={{ textDecoration: 'none', color: '#2980b9', fontWeight: 'bold' }}>Чат підтримки</Link>
          <Link to="/analytics" style={{ textDecoration: 'none', color: '#2980b9', fontWeight: 'bold' }}>Аналітика</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;