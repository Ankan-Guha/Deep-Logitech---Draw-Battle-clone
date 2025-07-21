import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './ChatBox.css';

const ChatBox = () => {
    const { socket, room, roomId, messages, isDrawer, me } = useGame();
    const [guess, setGuess] = useState('');

    const handleSendGuess = (e) => {
        e.preventDefault();
        if (guess.trim()) {
            socket.emit('guess', { roomId, guess });
            setGuess('');
        }
    };

    const canGuess = !isDrawer && me?.team === room?.currentTurn.team;

    return (
        <div className="chat-box">
            <ul className="messages">
                {messages.map((msg, index) => (
                    <li key={index} className={msg.system ? 'system' : ''}>
                        {msg.system ? msg.text : `${msg.player}: ${msg.guess}`}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSendGuess}>
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder={canGuess ? "Type your guess" : "You can't guess now"}
                    disabled={!canGuess}
                />
                <button type="submit" disabled={!canGuess}>Send</button>
            </form>
        </div>
    );
};

export default ChatBox; 