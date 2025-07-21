import React from 'react';
import { useGame } from '../context/GameContext';
import './GameStatus.css';

const GameStatus = () => {
    const { room } = useGame();
    if (!room || !room.currentTurn) return null;
    const drawer = room.currentTurn.drawer;
    const guessingTeam = room.currentTurn.team;
    return (
        <div className="game-status">
            <span className="drawer-status">
                <strong>{drawer?.name}</strong> (Team {drawer?.team}) is drawing
            </span>
            <span className="guessing-status">
                Team {guessingTeam} is guessing!
            </span>
        </div>
    );
};

export default GameStatus; 