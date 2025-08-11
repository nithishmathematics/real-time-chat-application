const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// In-memory message store (for demo). Replace with MongoDB for persistence.
const messages = []; // {id, room, user, text, time}

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('joinRoom', ({ room, user }) => {
    socket.join(room);
    console.log(`${user} joined ${room}`);
    // send last 50 messages for the room
    const roomMessages = messages.filter((m) => m.room === room).slice(-50);
    socket.emit('roomHistory', roomMessages);
    socket.to(room).emit('systemMessage', { text: `${user} joined the room` });
  });

  socket.on('sendMessage', (msg) => {
    // msg: {room, user, text}
    const message = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 9),
      ...msg,
      time: new Date().toISOString(),
    };
    messages.push(message);
    io.to(msg.room).emit('receiveMessage', message);
  });

  socket.on('leaveRoom', ({ room, user }) => {
    socket.leave(room);
    socket.to(room).emit('systemMessage', { text: `${user} left the room` });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

