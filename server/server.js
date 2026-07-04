const WebSocket = require('ws');
const http = require('http');

const port = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Imposter Party Realtime Server is Running!\n');
});

const wss = new WebSocket.Server({ server });

// Room structure: rooms[roomCode] = { host: ws, players: { playerId: { ws, name, color, emoji } } }
const rooms = {};

wss.on('connection', (ws) => {
  let userRoomCode = null;
  let userPlayerId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'host') {
        // Host creates a room
        userRoomCode = data.room;
        rooms[userRoomCode] = {
          host: ws,
          players: {}
        };
        console.log(`Room created: ${userRoomCode}`);
        ws.send(JSON.stringify({ type: 'hosted', room: userRoomCode }));
      } 
      else if (data.type === 'join') {
        // Player joins a room
        userRoomCode = data.room;
        userPlayerId = data.playerId;

        const room = rooms[userRoomCode];
        if (!room) {
          ws.send(JSON.stringify({ type: 'error', message: 'Room not found!' }));
          return;
        }

        room.players[userPlayerId] = {
          ws: ws,
          name: data.name,
          color: data.color,
          emoji: data.emoji
        };

        console.log(`Player ${data.name} joined room ${userRoomCode}`);
        
        // Notify the host about the new player
        if (room.host && room.host.readyState === WebSocket.OPEN) {
          room.host.send(JSON.stringify({
            type: 'player_joined',
            player: {
              id: userPlayerId,
              name: data.name,
              color: data.color,
              emoji: data.emoji
            }
          }));
        }

        ws.send(JSON.stringify({ type: 'joined', room: userRoomCode }));
      }
      else if (data.type === 'sync') {
        // Broadcast game states/events to everyone in the room
        const room = rooms[userRoomCode];
        if (room) {
          const payload = JSON.stringify(data);
          
          // Send to host
          if (room.host && room.host !== ws && room.host.readyState === WebSocket.OPEN) {
            room.host.send(payload);
          }
          
          // Send to players
          Object.values(room.players).forEach(p => {
            if (p.ws && p.ws !== ws && p.ws.readyState === WebSocket.OPEN) {
              p.ws.send(payload);
            }
          });
        }
      }
    } catch(e) {
      console.error(e);
    }
  });

  ws.on('close', () => {
    if (userRoomCode && rooms[userRoomCode]) {
      const room = rooms[userRoomCode];
      
      if (room.host === ws) {
        // If host disconnects, close room
        console.log(`Host disconnected. Closing room ${userRoomCode}`);
        Object.values(room.players).forEach(p => {
          if (p.ws && p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: 'error', message: 'Host disconnected. Room closed.' }));
          }
        });
        delete rooms[userRoomCode];
      } 
      else if (userPlayerId && room.players[userPlayerId]) {
        // If a player disconnects, notify host
        console.log(`Player ${room.players[userPlayerId].name} disconnected from room ${userRoomCode}`);
        delete room.players[userPlayerId];
        if (room.host && room.host.readyState === WebSocket.OPEN) {
          room.host.send(JSON.stringify({
            type: 'player_left',
            playerId: userPlayerId
          }));
        }
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
