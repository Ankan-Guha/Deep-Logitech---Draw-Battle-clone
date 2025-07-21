import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import './Timer.css';

const Timer = () => {
    const { room } = useGame();
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (room?.currentTurn?.startTime) {
            const timer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - room.currentTurn.startTime) / 1000);
                const remaining = 60 - elapsed;
                setTimeLeft(remaining > 0 ? remaining : 0);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [room?.currentTurn?.startTime]);

    if (!room || room.gameState !== 'playing') return null;

    return (
        <div className="timer">
            {timeLeft}
        </div>
    );
};

export default Timer; 