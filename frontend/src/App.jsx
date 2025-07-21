import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EnterNamePage from './pages/EnterNamePage';
import GamePage from './pages/GamePage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enter-name" element={<EnterNamePage />} />
          <Route path="/game/:roomId" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 