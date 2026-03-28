import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './components/Chat';
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Головна (Чат)</Link>
          <Link to="/analytics">Аналітика</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;