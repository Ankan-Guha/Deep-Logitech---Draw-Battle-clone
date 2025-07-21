import React from 'react';
import { useGame } from '../context/GameContext';
import './PlayerList.css';

const PlayerList = () => {
    const { room } = useGame();

    if (!room) return null;

    const team1 = room.players.filter(p => p.team === 1);
    const team2 = room.players.filter(p => p.team === 2);

    return (
        <div className="player-list-container">
            <div className="player-team-column">
                <h3>Team 1</h3>
                <ul>
                    {team1.map(p => <li key={p.id}>{p.name}</li>)}
                </ul>
            </div>
            <div className="player-team-column">
                <h3>Team 2</h3>
                <ul>
                    {team2.map(p => <li key={p.id}>{p.name}</li>)}
                </ul>
            </div>
        </div>
    );
};

export default PlayerList; 