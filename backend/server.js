const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { 
  createRoom, joinRoom, getRoom, leaveRoom, generateRoomId, 
  assignPlayerToTeam, startGameInRoom, startNextTurn, addScore 
} = require('./utils/rooms');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001", // In production, change this to your frontend URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const roundTimers = {};
const roundGuessed = {};

io.on('connection', (socket) => {
  let currentRoomId = null;

  socket.on('createRoom', (playerName, callback) => {
    const roomId = generateRoomId();
    const player = { id: socket.id, name: playerName };
    createRoom(roomId, player);
    socket.join(roomId);
    currentRoomId = roomId;
    callback({ roomId });
    io.to(roomId).emit('updateRoom', getRoom(roomId));
  });

  socket.on('joinRoom', ({ roomId, playerName }, callback) => {
    const player = { id: socket.id, name: playerName };
    const room = joinRoom(roomId, player);
    if (room) {
      socket.join(roomId);
      currentRoomId = roomId;
      callback({ success: true, room });
      io.to(roomId).emit('updateRoom', getRoom(roomId));
    } else {
      callback({ success: false, message: 'Room not found' });
    }
  });

  socket.on('joinTeam', ({ roomId, teamId }) => {
    const room = assignPlayerToTeam(roomId, socket.id, teamId);
    if (room) {
      io.to(roomId).emit('updateRoom', room);
    }
  });

  socket.on('startGame', (roomId) => {
    const result = startGameInRoom(roomId);
    if (result.success) {
      const room = startNextTurn(roomId);
      io.to(roomId).emit('clearCanvas');
      io.to(roomId).emit('roundStarted', room);
      roundGuessed[roomId] = false;
      // Start timer for the round
      if (roundTimers[roomId]) clearTimeout(roundTimers[roomId]);
      roundTimers[roomId] = setTimeout(() => {
        if (!roundGuessed[roomId]) {
          io.to(roomId).emit('systemMessage', { text: 'Time is up! No one guessed the word. 0 points awarded.' });
        }
        const nextRoundRoom = startNextTurn(roomId);
        io.to(roomId).emit('clearCanvas');
        io.to(roomId).emit('roundStarted', nextRoundRoom);
        roundGuessed[roomId] = false;
        if (nextRoundRoom && nextRoundRoom.gameState === 'game_over') {
          io.to(roomId).emit('gameOver', {
            scores: nextRoundRoom.scores,
            winner: nextRoundRoom.scores.team1 > nextRoundRoom.scores.team2 ? 'Team 1' : nextRoundRoom.scores.team2 > nextRoundRoom.scores.team1 ? 'Team 2' : 'Tie',
          });
          return;
        }
      }, 20000); // 20 seconds
    }
  });

  socket.on('draw', (data) => {
    if (currentRoomId) {
      socket.to(currentRoomId).emit('draw', data);
    }
  });

  socket.on('guess', ({ roomId, guess }) => {
    const room = getRoom(roomId);
    if (room && room.currentTurn.word.toLowerCase() === guess.toLowerCase()) {
      addScore(roomId, room.currentTurn.team, 100);
      io.to(roomId).emit('correctGuess', { 
        guesser: socket.id, 
        room: getRoom(roomId) 
      });
      roundGuessed[roomId] = true;
      // Clear the current timer and start the next round
      if (roundTimers[roomId]) clearTimeout(roundTimers[roomId]);
      const nextRoundRoom = startNextTurn(roomId);
      io.to(roomId).emit('clearCanvas');
      io.to(roomId).emit('roundStarted', nextRoundRoom);
      roundGuessed[roomId] = false;
      roundTimers[roomId] = setTimeout(() => {
        if (!roundGuessed[roomId]) {
          io.to(roomId).emit('systemMessage', { text: 'Time is up! No one guessed the word. 0 points awarded.' });
        }
        const anotherRoom = startNextTurn(roomId);
        io.to(roomId).emit('clearCanvas');
        io.to(roomId).emit('roundStarted', anotherRoom);
        roundGuessed[roomId] = false;
        if (anotherRoom && anotherRoom.gameState === 'game_over') {
          io.to(roomId).emit('gameOver', {
            scores: anotherRoom.scores,
            winner: anotherRoom.scores.team1 > anotherRoom.scores.team2 ? 'Team 1' : anotherRoom.scores.team2 > anotherRoom.scores.team1 ? 'Team 2' : 'Tie',
          });
          return;
        }
      }, 20000); // 20 seconds
      if (room.gameState === 'game_over') {
        io.to(roomId).emit('gameOver', {
          scores: room.scores,
          winner: room.scores.team1 > room.scores.team2 ? 'Team 1' : room.scores.team2 > room.scores.team1 ? 'Team 2' : 'Tie',
        });
        return;
      }
    } else {
      // Just broadcast the guess to everyone
      const player = room.players.find(p => p.id === socket.id);
      io.to(roomId).emit('guess', { player: player.name, guess });
    }
  });

  socket.on('disconnect', () => {
    if (currentRoomId) {
      leaveRoom(currentRoomId, socket.id);
      io.to(currentRoomId).emit('updateRoom', getRoom(currentRoomId));
    }
  });
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 