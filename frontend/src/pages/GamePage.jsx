import React from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import Scoreboard from '../components/Scoreboard';
import WordPrompt from '../components/WordPrompt';
import Canvas from '../components/Canvas';
import ChatBox from '../components/ChatBox';
import Timer from '../components/Timer';
import Lobby from './Lobby';
import PlayerList from '../components/PlayerList';
import PlayerStatus from '../components/PlayerStatus';
import GameStatus from '../components/GameStatus';
import './GamePage.css';

const GameOverScreen = ({ scores, winner }) => (
    <div className="game-over-screen">
        <h1>Game Over!</h1>
        <h2>Winner: {winner}</h2>
        <div className="final-scores">
            <div>Team 1: {scores.team1}</div>
            <div>Team 2: {scores.team2}</div>
        </div>
    </div>
);

const GamePageContent = () => {
    const { room, gameOver } = useGame();

    if (gameOver) {
        return <GameOverScreen scores={gameOver.scores} winner={gameOver.winner} />;
    }

    if (!room) return <div>Loading Game...</div>;

    if (room.gameState === 'lobby') {
        return <Lobby />;
    }

    if (room.gameState === 'playing') {
        return (
            <div className="game-page-container">
                <PlayerStatus />
                <GameStatus />
                <div className="game-container">
                    <div className="top-bar">
                        <Timer />
                        <WordPrompt />
                        <Scoreboard />
                    </div>
                    <div className="main-content">
                        <Canvas />
                        <ChatBox />
                    </div>
                    <PlayerList />
                </div>
            </div>
        );
    }
    
    return <div>Unhandled game state: {room.gameState}</div>;
}


const GamePage = () => {
  return (
    <GameProvider>
      <GamePageContent />
    </GameProvider>
  );
};

export default GamePage; 