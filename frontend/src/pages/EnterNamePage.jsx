import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import './EnterNamePage.css';

const EnterNamePage = () => {
  const [name, setName] = useState('');
  const socket = useSocket();
  const navigate = useNavigate();

  const handleJoinGame = () => {
    if (name.trim() === '') {
      alert('Please enter your name');
      return;
    }
    socket.emit('createRoom', name, ({ roomId }) => {
      navigate(`/game/${roomId}`);
    });
  };

  return (
    <div className="enter-name-container">
      <div className="input-group">
        <label htmlFor="name-input">my name is</label>
        <input 
          type="text" 
          id="name-input" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button className="btn join-btn" onClick={handleJoinGame}>join game</button>
      <a href="#" className="spectator-link">join as spectator</a>
    </div>
  );
};

export default EnterNamePage; 