import React from 'react';
import { useGame } from '../context/GameContext';
import './PlayerStatus.css';

const PlayerStatus = () => {
    const { me } = useGame();
    if (!me) return null;
    return (
        <div className="player-status">
            You are <strong>{me.name}</strong> (Team {me.team})
        </div>
    );
};

export default PlayerStatus; 