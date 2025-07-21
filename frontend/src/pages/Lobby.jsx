import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Lobby.css';

const Lobby = () => {
    const { socket, room, me, roomId } = useGame();
    const [error, setError] = useState('');

    const handleJoinTeam = (teamId) => {
        socket.emit('joinTeam', { roomId, teamId });
    };

    const handleStartGame = () => {
        setError('');
        socket.emit('startGame', roomId);
    };

    if (!room) return <div>Loading Lobby...</div>;

    const team1 = room.players.filter(p => p.team === 1);
    const team2 = room.players.filter(p => p.team === 2);

    const canStart = team1.length >= 2 && team2.length >= 2;

    return (
        <div className="lobby-container">
            <div className="lobby-header">
                <div>Room Code: <span className="room-code">{roomId}</span></div>
                <div>my name is <strong>{me?.name}</strong></div>
            </div>
            <div className="teams-container">
                <div className="team-column">
                    <h2>team 1</h2>
                    <ul className="player-list">
                        {team1.map(p => <li key={p.id}>{p.name}{p.id === socket.id && ' (you)'}</li>)}
                    </ul>
                    {me?.team === null && <button className="btn team-btn" onClick={() => handleJoinTeam(1)}>join team 1</button>}
                </div>
                <div className="team-column">
                    <h2>team 2</h2>
                    <ul className="player-list">
                        {team2.map(p => <li key={p.id}>{p.name}{p.id === socket.id && ' (you)'}</li>)}
                    </ul>
                    {me?.team === null && <button className="btn team-btn" onClick={() => handleJoinTeam(2)}>join team 2</button>}
                </div>
            </div>

            <div className="start-game-container">
                <button className="btn start-btn" onClick={handleStartGame} disabled={!canStart}>start game!</button>
                {!canStart && <p className="start-game-requirement">each team needs at least 2 players</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default Lobby; 