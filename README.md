🎥 Technical Walkthrough & Live Demo Script
1. Project Overview
DrawBattle Clone:
A real-time, team-based drawing and guessing game built with Node.js, Express, Socket.IO, and React.
Key Features:
2 teams, 4 players (2 per team)
Real-time drawing and chat
Turn-based rounds, timer, scoring, and game-over logic
Live updates across all player tabs
2. Architecture
Backend:
Node.js + Express server
Socket.IO for real-time communication
In-memory game state (rooms, players, teams, scores, rounds)
Frontend:
React (Vite) SPA
Socket.IO client for live updates
Context API for state management
Custom components: Canvas, ChatBox, Timer, Scoreboard, PlayerList, etc.
3. How Real-Time Works
Socket.IO enables:
Live drawing: Drawer’s strokes are broadcast to all players instantly
Live chat: Guesses and system messages appear in real time
Game state sync: Team joins, turn changes, timer, and scores update for everyone
4. Game Flow
Players join a room and select teams
Game starts when both teams have 2 players
Each round:
One player draws, teammate guesses (20s timer)
Correct guess: +100 points, next round
Timeout: 0 points, next round
After 4 rounds, the game ends and the winner is shown
5. Live Demo / Recording Plan
(Show your screen with 4 browser tabs open, each as a different player)
a. Lobby
Show team selection, room code, and player list updating live
b. Gameplay
Start the game
Show the drawer’s canvas and word prompt
Show teammates guessing in chat
Show timer counting down
Show real-time drawing replicated across all tabs
c. Scoring & Game Over
Show points being awarded for correct guesses
Let timer expire to show 0-point round
After 4 rounds, show the “Game Over” screen with scores and winner
d. Technical Highlight
Open the browser console or network tab to show live Socket.IO events
Optionally, show a snippet of the backend code (Socket.IO handlers, round logic)
6. Technical Challenges & Solutions
Real-time sync:
Used Socket.IO for low-latency, bidirectional updates
Canvas drawing:
Used HTML5 Canvas API, broadcasted drawing data as line segments
Game state management:
Used React Context for frontend, in-memory JS objects for backend
Turn/timer logic:
Managed on backend to prevent cheating and ensure fairness
7. Possible Extensions
Persistent storage (DB)
User authentication
Mobile support
Spectator mode
Audio/video chat

