const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Imposter Party Socket.io Server is active!');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Host creates a room
  socket.on('host_room', ({ room }) => {
    socket.join(room);
    socket.roomCode = room;
    socket.isHost = true;
    console.log(`Room hosted: ${room} by socket ${socket.id}`);
    socket.emit('room_hosted', { room });
  });

  // Player joins a room
  socket.on('join_room', ({ room, playerId, name, color, emoji }) => {
    socket.join(room);
    socket.roomCode = room;
    socket.playerId = playerId;
    socket.playerName = name;
    socket.isHost = false;

    console.log(`Player ${name} (${playerId}) joined room: ${room}`);

    // Broadcast to host/room that a player joined
    socket.to(room).emit('player_joined', {
      player: { id: playerId, name, color, emoji }
    });

    socket.emit('room_joined', { room });
  });

  // Sync game actions
  socket.on('sync_action', (data) => {
    if (socket.roomCode) {
      // Send to all other clients in the room
      socket.to(socket.roomCode).emit('sync_action', data);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const { roomCode, isHost, playerId, playerName } = socket;

    if (roomCode) {
      if (isHost) {
        console.log(`Host left. Closing room: ${roomCode}`);
        socket.to(roomCode).emit('room_closed', { message: 'Host disconnected. Room closed.' });
      } else if (playerId) {
        console.log(`Player ${playerName} left room: ${roomCode}`);
        socket.to(roomCode).emit('player_left', { playerId });
      }
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
