import React from 'react';
import { useGame } from '../context/GameContext';
import './WordPrompt.css';

const WordPrompt = () => {
    const { room, isDrawer } = useGame();
    if (!room || room.gameState !== 'playing') return null;

    const word = room.currentTurn.word;

    return (
        <div className="word-prompt">
            {isDrawer ? (
                <>Your word: <span className="word">{word}</span></>
            ) : (
                <>{word.split('').map((char, i) => <span key={i} className="word-placeholder">_</span>)}</>
            )}
        </div>
    );
};

export default WordPrompt; 