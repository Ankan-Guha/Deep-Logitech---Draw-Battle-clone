import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useParams } from 'react-router-dom';

const GameContext = createContext();

export const useGame = () => {
  return useContext(GameContext);
};

export const GameProvider = ({ children }) => {
  const socket = useSocket();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [gameOver, setGameOver] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleUpdateRoom = (updatedRoom) => setRoom(updatedRoom);
    const handleRoundStarted = (updatedRoom) => {
        setRoom(updatedRoom);
        setMessages([]); // Clear chat on new round
    };
    const handleGuess = (message) => setMessages(prev => [...prev, message]);
    const handleCorrectGuess = ({ guesser, room: updatedRoom }) => {
        setRoom(updatedRoom);
        const guesserName = updatedRoom.players.find(p => p.id === guesser)?.name || 'Someone';
        setMessages(prev => [...prev, { system: true, text: `${guesserName} guessed the word!` }]);
    };
    const handleSystemMessage = (msg) => setMessages(prev => [...prev, { system: true, text: msg.text }]);
    const handleGameOver = (data) => setGameOver(data);

    socket.on('updateRoom', handleUpdateRoom);
    socket.on('roundStarted', handleRoundStarted);
    socket.on('guess', handleGuess);
    socket.on('correctGuess', handleCorrectGuess);
    socket.on('systemMessage', handleSystemMessage);
    socket.on('gameOver', handleGameOver);
    
    // Initial fetch of room data
    socket.emit('joinRoom', { roomId, playerName: 'spectator' }, (response) => {
        if (response.success) {
          setRoom(response.room)
        }
    });

    return () => {
      socket.off('updateRoom', handleUpdateRoom);
      socket.off('roundStarted', handleRoundStarted);
      socket.off('guess', handleGuess);
      socket.off('correctGuess', handleCorrectGuess);
      socket.off('systemMessage', handleSystemMessage);
      socket.off('gameOver', handleGameOver);
    };
  }, [socket, roomId]);

  const value = {
    socket,
    room,
    roomId,
    me: room?.players.find(p => p.id === socket.id),
    isDrawer: room?.currentTurn.drawer?.id === socket.id,
    messages,
    gameOver,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}; 