import React from 'react';
import { useGame } from '../context/GameContext';
import './Scoreboard.css';

const Scoreboard = () => {
    const { room } = useGame();
    if (!room) return null;

    return (
        <div className="scoreboard">
            <div className="team-score team-1">
                Team 1: {room.scores.team1}
            </div>
            <div className="team-score team-2">
                Team 2: {room.scores.team2}
            </div>
        </div>
    );
};

export default Scoreboard; 