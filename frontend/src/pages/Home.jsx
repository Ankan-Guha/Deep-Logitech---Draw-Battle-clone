import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import './Home.css';

const Home = () => {
  const [roomCode, setRoomCode] = useState('');
  const socket = useSocket();
  const navigate = useNavigate();

  const handleJoinGame = () => {
    if (roomCode.trim() === '') {
      alert('Please enter a room code');
      return;
    }
    const playerName = prompt('Please enter your name:');
    if (!playerName || playerName.trim() === '') {
      alert('A name is required to join');
      return;
    }
    socket.emit('joinRoom', { roomId: roomCode.toUpperCase(), playerName }, (response) => {
      if (response.success) {
        navigate(`/game/${roomCode.toUpperCase()}`);
      } else {
        alert(response.message);
      }
    });
  };

  return (
    <div className="home-container">
      <header className="main-header">
        <h1>draw battle!</h1>
        <p>two teams of drawers face off with a frantic final round</p>
      </header>
      
      <div className="game-actions">
        <Link to="/enter-name" className="btn new-game-btn">new game</Link>
        <div className="join-game">
          <input 
            type="text" 
            placeholder="enter 4-letter code" 
            className="join-code-input"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)} 
            maxLength="4"
          />
          <button className="btn join-game-btn" onClick={handleJoinGame}>join game</button>
        </div>
      </div>
      
      <div className="how-to-play">
        <h2>how to play</h2>
        <ul>
          <li>split up into two teams of 2 or more players</li>
          <li>draw and guess each word before the other team</li>
          <li>replay the same words again in a frantic final round</li>
        </ul>
      </div>

      <footer className="main-footer-bottom">
        <p>terms | discord | twitter | buy us coffee</p>
      </footer>
    </div>
  );
};

export default Home; 