const { getRandomWord } = require('./wordList');

const MAX_ROUNDS = 4;

const rooms = {};

const createRoom = (roomId, player) => {
  rooms[roomId] = {
    id: roomId,
    players: [{ ...player, team: null, score: 0 }],
    gameState: 'lobby', // lobby, playing, between_rounds, game_over
    drawings: [],
    currentTurn: {
      team: null,
      drawer: null,
      word: '',
      startTime: null,
    },
    turnOrder: [],
    round: 0,
    scores: {
      team1: 0,
      team2: 0,
    }
  };
};

const joinRoom = (roomId, player) => {
  if (rooms[roomId]) {
    rooms[roomId].players.push({ ...player, team: null, score: 0 });
    return rooms[roomId];
  }
  return null;
};

const assignPlayerToTeam = (roomId, playerId, teamId) => {
    if (!rooms[roomId]) return null;
    const player = rooms[roomId].players.find(p => p.id === playerId);
    if (player) {
        player.team = teamId;
    }
    return rooms[roomId];
}

const getRoom = (roomId) => {
  return rooms[roomId];
};

const leaveRoom = (roomId, playerId) => {
    if (rooms[roomId]) {
        const player = rooms[roomId].players.find(p => p.id === playerId);
        if(!player) return;

        rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== playerId);
        // If the player was the current drawer, end the turn
        if(rooms[roomId].currentTurn.drawer?.id === playerId) {
            // We'll handle turn logic later
        }

        if (rooms[roomId].players.length === 0) {
            delete rooms[roomId];
            console.log(`Room ${roomId} deleted.`);
        }
    }
};

const startGameInRoom = (roomId) => {
    if(rooms[roomId]){
        const team1 = rooms[roomId].players.filter(p => p.team === 1);
        const team2 = rooms[roomId].players.filter(p => p.team === 2);
        if (team1.length >= 2 && team2.length >= 2) { // Changed back to 2
            rooms[roomId].gameState = 'playing';
            // Create the turn order (interleaved teams)
            const turnOrder = [];
            let i = 0;
            while (i < team1.length || i < team2.length) {
                if (team1[i]) turnOrder.push(team1[i].id);
                if (team2[i]) turnOrder.push(team2[i].id);
                i++;
            }
            rooms[roomId].turnOrder = turnOrder;
            rooms[roomId].round = 0;
            
            return { success: true, room: rooms[roomId] };
        } else {
            return { success: false, message: 'Each team needs at least 2 players' };
        }
    }
    return { success: false, message: 'Room not found' };
}

const startNextTurn = (roomId) => {
    const room = rooms[roomId];
    if (!room) return null;

    // End game if round limit reached
    if (room.round >= MAX_ROUNDS) {
        room.gameState = 'game_over';
        return room;
    }

    const drawerId = room.turnOrder[room.round % room.turnOrder.length];
    const drawer = room.players.find(p => p.id === drawerId);
    
    if(!drawer) {
        // This player might have disconnected, skip to next.
        room.round++;
        return startNextTurn(roomId);
    }
    
    room.currentTurn = {
        team: drawer.team,
        drawer: drawer,
        word: getRandomWord(),
        startTime: Date.now(),
    };
    room.round++;
    room.drawings = []; // Clear drawings for the new round

    return room;
}

const addScore = (roomId, teamId, points) => {
    if (rooms[roomId]) {
        rooms[roomId].scores[`team${teamId}`] += points;
    }
}

const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

module.exports = {
  createRoom, joinRoom, getRoom, leaveRoom, generateRoomId,
  assignPlayerToTeam, startGameInRoom, startNextTurn, addScore
}; 